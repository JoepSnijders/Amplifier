var app = angular.module('amplifier', ['ngRoute', 'ngAutocomplete', '720kb.tooltips', '720kb.datepicker', 'angularMoment', 'ngFileUpload']);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $routeProvider
        .when('/', {
            template: '<div></div>',
            controller: function($window, $http){
                $http.get('/').success(function(){
                    $window.location.reload();
                });
            }
        })
        .when('/app', {
            templateUrl: '/partials/agendas.html',
            controller: 'agendasCtrl'
        })
        .when('/app/bands', {
            templateUrl: '/partials/bands.html',
            controller: 'bandsCtrl'
        })
        .when('/app/bands/:id', {
            templateUrl: '/partials/band.html',
            controller: 'bandCtrl'
        })
        .when('/app/musicians', {
            templateUrl: '/partials/musicians.html',
            controller: 'musiciansCtrl'
        })
        .when('/app/profile/:id', {
            templateUrl: '/partials/profile.html',
            controller: 'profileCtrl'
        })
        .when('/logout', {
            template: '<div></div>',
            controller: function($window, $http){
                $http.get('/logout').success(function(){
                    $window.location.reload();
                });
            }
        })
        .when('/auth/facebook', {
            template: '<div></div>',
            controller: 'LogInCtrl'
        })
        .when('/auth/google', {
            template: '<div></div>',
            controller: 'LogInCtrl'
        })
        .when('/auth/twitter', {
            template: '<div></div>',
            controller: 'LogInCtrl'
        });
});
app.controller('agendasCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.search = function(){
        $http.get('/api/agendas?location='  + $scope.location + '&radius=' + $scope.radius).success(function (response) {
          $scope.data = response;
        });
    };
    $scope.searchUrl = function(){
        $http.get('/api/agendas?location='  + $routeParams.location + '&radius=' + $routeParams.radius).success(function (response) {
            $scope.data = response;
        });
    };
    $scope.refresh = function(){
        $http.get('/api/agendas').success(function(response) {
            $scope.data = response;
        });
    };
    if ($routeParams.location) $scope.searchUrl();
    if ($routeParams.location) {
        $scope.location = $routeParams.location;
        $scope.radius = $routeParams.radius;
    }
    $scope.refresh();

    $(".nav li span").removeClass("active");
    $(".nav .app span").addClass("active");
}]);
app.controller('bandsCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.search = function(){
        $http.get('/api/bands?location='  + $scope.location + '&radius=' + $scope.radius).success(function (response) {
            $scope.data = response;
        });
    };
    $scope.searchUrl = function(){
        $http.get('/api/bands?location='  + $routeParams.location + '&radius=' + $routeParams.radius).success(function (response) {
            $scope.data = response;
        });
    };
    function refresh(){
        $http.get('/api/bands').success(function (response) {
            $scope.data = response;
        });
    }
    if ($routeParams.location) $scope.searchUrl();
    if ($routeParams.location) {
        $scope.location = $routeParams.location;
        $scope.radius = $routeParams.radius;
    }
    refresh();

    $(".nav li span").removeClass("active");
    $(".nav .band span").addClass("active");
}]);
app.controller('bandCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.saveAgenda = function(newDate, newVenture, newLocation, newTime, newPrice){
        $http.post('/api/agendas/' + $routeParams.id, {date: newDate, venture: newVenture, location: newLocation, time: newTime, price: newPrice}).success(function(result){
            $scope.refresh();
        });
    };
    $scope.removeAgenda = function(id){
        $http.delete('/api/agendas/' + id).success(function(result){
            $scope.refresh();
            $("#right-sidebar").removeClass("active");
        });
    };
    $scope.showDetails = function(id){
        $("#right-sidebar").addClass("active");
        $http.get('/api/agendas/' + id).success(function(result){
            $scope.agendaDetails = result;
            initMap($scope.agendaDetails);
        });
    };
    $scope.refresh = function(){
        $http.get('/api/bands/' + $routeParams.id).success(function (response) {
            $scope.data = response;
        });
    };
    $scope.urlID = $routeParams.agenda;
    $scope.refresh();

    $(".nav li span").removeClass("active");
    $(".nav .band span").addClass("active");
}]);
app.controller('musiciansCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.search = function(location, radius){
        $http.get('/api/musicians?location='  + $scope.location + '&radius=' + $scope.radius).success(function (response) {
            $scope.data = response;
        });
    };
    $scope.searchUrl = function(){
        $http.get('/api/musicians?location='  + $routeParams.location + '&radius=' + $routeParams.radius).success(function (response) {
            $scope.data = response;
        });
    };
    $scope.refresh = function(){
        $http.get('/api/musicians').success(function (response) {
            $scope.data = response;
        });
    };
    if ($routeParams.location) $scope.searchUrl();
    if ($routeParams.location) {
        $scope.location = $routeParams.location;
        $scope.radius = $routeParams.radius;
    }

    $scope.refresh();

    $(".nav li span").removeClass("active");
    $(".nav .musicians span").addClass("active");
}]);
app.controller('profileCtrl', ['$scope', '$sce', '$location', '$http', '$routeParams', function($scope, $sce, $location, $http, $routeParams){
    $scope.editorEnabled = false;
    $scope.enableEditor = function() {
        $scope.editorEnabled = true;
        $scope.editableTitle = profile.title;
    };
    $scope.disableEditor = function() {
        $scope.editorEnabled = false;
    };
    $scope.saveBio = function(newBio) {
        $http.put('/api/users/' + $routeParams.id + '/bio', {bio: newBio}).success(function(result){
            $scope.refresh();
        });
        $scope.disableEditor();
    };
    $scope.saveInstrument = function(newInstrument, newExperience){
        $http.put('/api/users/' + $routeParams.id + '/instrument', {instrument: newInstrument, experience: newExperience}).success(function(result){
            $scope.refresh();
        });
    };
    $scope.removeInstrument = function(instrumentId){
        $http.delete('/api/users/' + $routeParams.id + '/instrument/' + instrumentId).success(function(result){
            $scope.refresh();
        });
    };
    $scope.saveGenre = function(genre){
        $http.put('/api/users/' + $routeParams.id + '/genre', {genre: genre}).success(function(result){
            $scope.refresh();
        });
    };
    $scope.removeGenre = function(genreId){
        $http.delete('/api/users/' + $routeParams.id + '/genre/' + genreId).success(function(result){
            $scope.refresh();
        });
    };
    $scope.saveArtist = function(artist){
        $http.put('/api/users/' + $routeParams.id + '/artist', {artist: artist}).success(function(result){
            $scope.refresh();
        });
    };
    $scope.removeArtist = function(artistId){
        $http.delete('/api/users/' + $routeParams.id + '/artist/' + artistId).success(function(result){
            $scope.refresh();
            $("#right-sidebar").removeClass("active");
        });
    };
    $scope.zoomArtist = function(artistId){
        $("#right-sidebar").addClass("active");
        $http.get('/api/users/' + $routeParams.id + '/artist/' + artistId).success(function(result){
            $scope.zoomedArtistBio = $sce.trustAsHtml(result.bio);
            $scope.zoomedArtist = result;
        });
    };
    $scope.startLooking = function(){
        $http.put('/api/users/' + $routeParams.id + '/start').success(function(result){
            $scope.refresh();
        });
    };
    $scope.stopLooking = function(){
        $http.put('/api/users/' + $routeParams.id + '/stop').success(function(result){
            $scope.refresh();
        });
    };
    $scope.addBand = function(bandname, bandbio, bandcity, bandgenres){
        $http.post('/api/bands/', { bandname: bandname, bandbio: bandbio, bandcity: bandcity, bandgenres: bandgenres}).success(function(result){
            $location.path('/app/bands/' + result._id);
            $("#create-band").removeClass("active");
        });
    };
    $scope.editInfo = function(){
        $http.put('/api/users/'+ $routeParams.id + '/address', { city: profile.city, postcode: profile.postcode}).success(function(result){
            $scope.refresh();
        });
    };
    $scope.refresh = function(){
        $http.get('/api/users/' + $routeParams.id).success(function (response) {
            $scope.data = response;
        });
    };
    $scope.refresh();

    $(".nav li span").removeClass("active");

}]);
app.controller('homeCtrl', ['$scope', '$window', function($scope, $window){
    $scope.url = "";
    $scope.send = function(url, radius, location){
        $window.location.href = '/app' + $scope.url + '?location=' + $scope.location + '&radius=' + $scope.radius;
    };
    $scope.location = $scope.user;
}]);
app.controller('logInCtrl', ['$scope', '$window', function($scope, $window){
    $window.location.reload();
}]);

app.controller('uploadCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/app/upload',
                data: {file: file}
            });
            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };
}]);

app.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    };
  }
]);
