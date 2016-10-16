$(document).ready(function() {

    $(".close").click(function(e){
        e.preventDefault();
        $(this).parents("body").toggleClass("closed");
        $(this).parents("#sidebar").toggleClass("closed");
    });
    $(document).on("click", ".create-band", function(e){
        e.preventDefault();
        $("#create-band").toggleClass("active");
        $("#create-band .overlay").toggleClass("active");
    });
    $(document).on("click", ".close-overlay", function(e){
        e.preventDefault();
        $("#create-band").removeClass("active");
        $("#create-band .overlay").removeClass("active");
        $("#first-time").removeClass("active");
        $("#login").removeClass("active");
        $("#register").removeClass("active");
    });
    $(document).on("click", ".full-overlay", function(e){
        e.preventDefault();
        $("#create-band").removeClass("active");
        $("#create-band .overlay").removeClass("active");
        $("#right-sidebar").removeClass("active");
        $("#first-time").removeClass("active");
        $("#login").removeClass("active");
        $("#register").removeClass("active");
    });
    $(document).on("click", ".register-btn", function(e){
        e.preventDefault();
        $("#create-band").removeClass("active");
        $("#create-band .overlay").removeClass("active");
        $("#first-time").removeClass("active");
        $("#login").removeClass("active");
        $("#register").addClass("active");
    });
    $(document).on("click", ".login-btn", function(e){
        e.preventDefault();
        $("#create-band").removeClass("active");
        $("#create-band .overlay").removeClass("active");
        $("#first-time").removeClass("active");
        $("#register").removeClass("active");
        $("#login").addClass("active");
    });
    $(document).on("click", ".edit-agenda", function(e){
        e.preventDefault();
        $("tr.edit").toggleClass("active");
        if ($(this).html() == "Add Agenda") {
            $(this).html("Close");
        }
        else {
            $(this).html("Add Agenda");
        }
    });
    $(document).on("click",".login", function(e) {
        $("#login").addClass("active");
    });
    $(document).on("click",".signup", function(e) {
        $("#register").addClass("active");
    });
    $("#cookies .sluit").click(function(e) {
        $("#cookies").removeClass("active");
    });
    $(document).on("click", ".mobile-header", function(e){
        e.preventDefault();
        $("#sidebar").toggleClass("opened");
    });
});
