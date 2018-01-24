(function () {

    /////////////////////////////////////////////
    // Init google map
    // adding-a-google-map - https://developers.google.com/maps/documentation/javascript/
    // marker-remove - https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    /////////////////////////////////////////////
    var mapInitDefault = {
        zoom: 5,
        center: { lat: 47.5833, lng: 18.9333 } // ~ near Budapest
    };
    var marker; // the only one marker on the map
    var map; // map instance
    window.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), mapInitDefault);
    };

    function replaceMarker(lat, lng) {
        if (marker) marker.setMap(null); // remove old marker
        marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map
        });
        map.setCenter(marker.getPosition());
    }

    $('#map').on('iplookup.ipfetched', function(evt, ip, result){
        replaceMarker(result.lat, result.lon);
    });

})();