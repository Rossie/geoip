(function () {
    var testing = (location.hostname === "localhost" || location.hostname === "127.0.0.1");

    /////////////////////////////////////////////
    // inint highlight.js
    // https://github.com/isagalaev/highlight.js
    /////////////////////////////////////////////

    /////////////////////////////////////////////
    // IP lookup
    /////////////////////////////////////////////

    $(function () {
        // if (testing) $('#txtIpAddress').val('31.46.203.115');

        /////////////////////////////////////////////
        // Parse path
        /////////////////////////////////////////////
        var query = window.location.pathname.split('/');
        var urlIp;
        if (query.length >= 3) {
            urlIp = query[2];
            $('#txtIpAddress').val(urlIp);
            lookupIp();
        }

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
    $('#lookupPanel').on('iplookup.invoked', function (evt) {
        $(this).fadeOut('fast');
    });

    $('#lookupPanel').on('iplookup.datafetched', function (evt, data) {
        var result = $('#lookupResult').html(JSON.stringify(data, null, 2)); // put json string into result panel
        hljs.highlightBlock(result[0]); // highlight code
        $(this).delay(0).slideDown('slow');
    });

    ///////////////////////////////
    // Error handler
    ///////////////////////////////
    $('#lookupError').on('iplookup.error', function (evt, error) {
        console.error(error);
        $(this).html(error); // display error message
        $(this).delay(0).slideDown('slow');
    });

    $('#lookupError').on('iplookup.invoked', function (evt, error) {
        $(this).fadeOut('fast');
    });

})();
