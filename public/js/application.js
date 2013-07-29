var map;

function initialize(center) {
  var mapOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: center
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function () {
  $.post("http://maps.googleapis.com/maps/api/geocode/json?address=Berlin&sensor=false", function (response) {
    var lat = response.results[0].geometry.location.lat;
    var lng = response.results[0].geometry.location.lng;
    center = new google.maps.LatLng(lat, lng);
    initialize(center);
  })

  $("#enter").keydown(function (e){
    if (e.keyCode == 13) {
      e.preventDefault();
      var append = ($(this).val().split(' ').join('+'));
      $.post("http://maps.googleapis.com/maps/api/geocode/json?address="+append+"&sensor=false", function (response) {
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        center = new google.maps.LatLng(lat, lng);
        initialize(center);
        $("#map-canvas").animate({opacity: 1});
        $(".enter").animate({bottom: 20});
        var val = $(".enter form input").val();
        $("#connect").slideDown();
        $(".header").text("Going to "+val+"?");  
        $("input#lat").val(lat);  
        $("input#lng").val(lng);  
        $("input#city").val(val);  
        $(".enter form input").val("");
        $(".slogan").remove();
      });
    }
  });

  $(".hover").on('click', function(e){
    e.preventDefault();
    $(".nav").slideToggle();
    $(".pic").slideToggle();
    $(".minislogan").slideToggle();
    $(".login-name").slideToggle();
    $(".logout").slideToggle();
  });


// $('.fb').on('click', function(e) {
//   e.preventDefault();
//   // alert('here');
//   $('#whichMarker2').slideUp('fast');
// });

  $("#create_url").on('submit', function(e){
    e.preventDefault();
    var data = $(this).serialize();
    $(this).slideUp('fast');
    $.post('/create_map', data, function(response){
      $("#url").text(response);
      $("#url").slideDown('fast');
      $("#new_text").slideDown('fast');
    });
  });
});



