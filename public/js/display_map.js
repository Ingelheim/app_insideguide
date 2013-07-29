var choice;
var map;
var current_user;
var markers = [];

function initialize(center) {
    var infobox;
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $.get('/populate', url, function (data) {
        var array = JSON.parse(data);
        array.forEach(createTag);
    });
}

function addToForm(lat, lng, coord) {
    $("#lat").val(lat);
    $("#lng").val(lng);
    $("#url").val(url);
    $("#user").val(current_user);
    var address;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': coord}, function(results) {   
        var address = results[0].formatted_address.split(", ").join("<br>");
        var formAddy = '<p class="adresse">'+address+'</p>'
        $(".adress>p").remove();
        $(".adress").append(formAddy);
        console.log(formAddy);
    });
}

function clearOverlays() {
  setAllMap(null);
}

function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
}
}

function createTag(element, index, array) {
    var lat = element[0];
    var lng = element[1];
    var place = element[2];
    var description = element[3];
    var select = element[4];
    var url = element[5];
    var name = element[6];
    var position = new google.maps.LatLng(lat, lng);
    addMarker(position, place, description, select, url, name);
}

function placeMarker(position, map) {
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: '/img/'+choice.toLowerCase()+'.png'
    });
    markers.push(marker);
}

function saveToDatabase(lat, lng, person) {
    $.post('/data', {
        "lat": lat,
        "lng": lng,
        "person": person,
        "url":url
    }, function (response) {
        var array = JSON.parse(response);
        alert(response);
        var position = new google.maps.LatLng(array[0], array[1]);
        addMarker(position, array[2], array[3], array[4], array[5], array[6]);
    });
}
var count = 1;
function addMarker(position, place, description, select, url, name) {

    var marker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: false,
        icon:'/img/'+select.toLowerCase()+'.png'
    });
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': position}, function(results) {   
        var addy = results[0].formatted_address.split(", ").join("<br>");
    });

    appendInfobox(place, description, name, url, count);

    marker.infobox = new InfoBox({
       content: document.getElementsByClassName(count)[0],
       disableAutoPan: false,
       maxWidth: 150,
       pixelOffset: new google.maps.Size(-140, 0),
       zIndex: null,
       boxStyle: {
        background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
        opacity: 0.90,
        width: "280px"
    },
    closeBoxMargin: "12px 4px 2px 2px",
    closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
    infoBoxClearance: new google.maps.Size(1, 1)
});
    count++;

    google.maps.event.addListener(marker, 'click', function () {
        this.infobox.open(map, this);
    });

}

var appendInfobox = function(title, description, name, url, count) {
  var box = "<div id='infobox' class='"+count+"'><p id='box-title'>"+title+"</p><p id='box-description'>"+description+"</p><img id='tagpic' src='"+url+"'><span id='box-name><strong>by "+name+"</strong></span></div>";
  $('.infobox-wrapper').append(box);
};


$(document).ready(function () {

    // $("#whichMarker2").slideDown('fast');

    $(".polaroid").on('click', function(){
        $(".polaroidhover").removeClass('polaroidhover');
        $(this).toggleClass('polaroidhover');
        choice = $(this).children(".label").text().toLowerCase();

        $(".setM2").on("click", function(e){
            e.preventDefault();
            $('#whichMarker').slideUp('fast');
            $('#hiddenSelect').val(choice);
            google.maps.event.addListener(map, 'click', function (e) {

              clearOverlays();
              var coord = e.latLng;
              var lat = coord.lat();
              var lng = coord.lng();
              placeMarker(coord, map);
              addToForm(lat, lng, coord);
              $(".enter_tip").slideDown('fast');
          });
        });
    });

    $(".setM").on("click", function(e){
        e.preventDefault();
        clearOverlays();
        $('#whichMarker').slideDown('fast');

    });

$("#clicker2").on("click", function(e){
        e.preventDefault();
        $('#whichMarker2').slideUp('fast');
$('#whichMarker').delay(500).slideDown('fast');
    });


});

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function () {
    $.post("http://maps.googleapis.com/maps/api/geocode/json?address=Berlin+Germany&sensor=false", function (response) {
        center = new google.maps.LatLng(lat, lng);
        initialize(center);
    })

    $("#rece").on('submit', function (e) {
        e.preventDefault();
        $(".enter_tip").slideUp('fast');
        var data = $("#rece").serialize();
        $(this).trigger('reset');
        $.post('/data', data, function (response) {
            var array = JSON.parse(response);
            var position = new google.maps.LatLng(array[0], array[1]);
            addMarker(position, array[2], array[3], array[4], array[5], array[6]);
        });
    });

    // $("#enter").on('blur', function (e){
    //     var append = ($(this).val().split(' ').join('+'));
    //     $.post("http://maps.googleapis.com/maps/api/geocode/json?address="+append+"&sensor=false", function (response) {
    //         var lat = response.results[0].geometry.location.lat;
    //         var lng = response.results[0].geometry.location.lng;
    //         center = new google.maps.LatLng(lat, lng);
    //         initialize(center);
    //         $("#map-canvas").css('opacity', 1);
    //         $(".enter").css('bottom', 20);
    //         var val = $(".enter form input").val();
    //         $("#connect").show();
    //         $(".header").text("Going to "+val+"?");  
    //         $("input#lat").val(lat);  
    //         $("input#lng").val(lng);  
    //         $("input#city").val(val);  
    //         $(".enter form input").val("");
    //         $(".slogan").remove();

    //     });

    // })

    $(".hover").on('click', function(e){
        e.preventDefault();
        $(".nav").slideToggle();
        $(".pic").slideToggle();
        $(".minislogan").slideToggle();
        $(".login-name").slideToggle();
        $(".logout").slideToggle();
    });

    // $("#create_url").on('submit', function(e){
    //     e.preventDefault();
    //     var data = $(this).serialize();
    //     $(this).hide();
    //     $.post('/create_map', data, function(response){
    //         $("#url").text(response);
    //         $("#url").show();
    //     });
    // });
});



























