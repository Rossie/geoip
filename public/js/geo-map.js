(function () {
    var testing = (location.hostname === "localhost" || location.hostname === "127.0.0.1");

    /////////////////////////////////////////////
    // Init google map
    // adding-a-google-map - https://developers.google.com/maps/documentation/javascript/
    // marker-remove - https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    /////////////////////////////////////////////
    var mapInitDefault = {
        zoom: 5,
        center: {lat: 47.5833, lng: 18.9333} // ~ near Budapest
    };
    var marker; // the only one marker on the map
    var map; // map instance
    window.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), mapInitDefault);
    };

    function replaceMarker(lat, lng) {
        if (marker) marker.setMap(null); // remove old marker
        marker = new google.maps.Marker({
            position: {lat:lat, lng:lng},
            map: map
        });
        map.setCenter(marker.getPosition());
    }

    /////////////////////////////////////////////
    // inint highlight.js
    // https://github.com/isagalaev/highlight.js
    /////////////////////////////////////////////
    $(function () {
        highlightInit();
    });
    function highlightInit() {
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }
    
    /////////////////////////////////////////////
    // IP lookup
    /////////////////////////////////////////////

    $(function(){
        if (testing) $('#txtIpAddress').val('31.46.203.115');

        $('#btnLookup').click(function(){
            lookupIp();
        });

        function lookupIp(){
            var ip = $('#txtIpAddress').val();
            if (!ip) return;

            $.ajax({
                dataType: "json",
                url: '/api?format=json&ip='+ip,
                success: function(result){
                    $('#lookupResult').html(JSON.stringify(result, null, 2));
                    highlightInit();
                    $('#looupPanel').slideDown('slow');
                    if (result.status == 'success'){
                        replaceMarker(result.lat, result.lon);
                    }
                },
                error: function( jqXHR, textStatus, errorThrown ) {
                    console.error(errorThrown);
                    $('#lookupResult').html(errorThrown);
                    $('#looupPanel').slideDown('slow');
                }
            });
        }

    });
})();