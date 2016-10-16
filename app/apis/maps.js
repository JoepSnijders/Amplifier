// Google Maps Configure
var GoogleMapsAPI = require('googlemaps');
var publicConfig = {
  key: 'AIzaSyANKTFwm7cU4Zii_tOlEc-51jDCl9RsZho',
  stagger_time:       1000, // for elevationPath
  secure:             true // use https
};
var gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = gmAPI;
