(function () {
    var testing = (location.hostname === "localhost" || location.hostname === "127.0.0.1");

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
    /////////////////////////////////////////////
    // inint highlight.js
    // https://github.com/isagalaev/highlight.js
    /////////////////////////////////////////////

    /////////////////////////////////////////////
    // IP lookup
    /////////////////////////////////////////////

    $(function () {
        if (testing) $('#txtIpAddress').val('31.46.203.115');

        $('#btnLookup').click(function () {
            lookupIp();
        });

        function lookupIp() {
            var ip = $('#txtIpAddress').val(); // get ip from input[text]
            if (!ip) return;
            $('.subscriber.iplookup-invoked').trigger('iplookup.invoked', [ip]);

            $.ajax({
                dataType: "json",
                url: '/api?format=json&ip=' + ip,
                success: function (result) {
                    $('.subscriber.iplookup-data').trigger('iplookup.datafetched', [result]);
                    if (result.status == 'success') {
                        $('.subscriber.ipfetched').trigger('iplookup.ipfetched', [ip, result]);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(errorThrown);
                    $('.subscriber.iplookup-error').trigger('iplookup.error', [errorThrown]);
                }
            });
        }
    });

    ///////////////////////////////
    // Result panel
    ///////////////////////////////    
    $('#lookupPanel').on('iplookup.invoked', function(evt){
        $(this).fadeOut('fast');
    });

    $('#lookupPanel').on('iplookup.datafetched', function(evt, data){
        var result = $('#lookupResult').html(JSON.stringify(data, null, 2)); // put json string into result panel
        hljs.highlightBlock(result[0]); // highlight code
        $(this).delay(0).slideDown('slow');
    });

    ///////////////////////////////
    // Error handler
    ///////////////////////////////
    $('#lookupError').on('iplookup.error', function(evt, error){
        console.error(error);
        $(this).html(error); // display error message
        $(this).delay(0).slideDown('slow');
    });
    
    $('#lookupError').on('iplookup.invoked', function(evt, error){
        $(this).fadeOut('fast');
    });


})();