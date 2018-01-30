$(function () {
    // https://stackoverflow.com/questions/399867/custom-events-in-jquery     

    var _ip = window.viewIp;
    ///////////////////////////////////////////////////
    // Comments for the IP address
    ///////////////////////////////////////////////////
    $(document).on('iplookup.ipfetched', function (evt, ip, result) {
        // COMMENT sometimes you use camelCase, sometimes underscore, please use consistent naming convention
        $('#commentsTitleIp').html(ip);
        _ip = ip;
        fetchComments();
    });

    function fetchComments() {
        $('.subscriber.comment-invoked').trigger('comment.invoked');
        $.ajax({
            dataType: "json",
            url: '/comment-api/' + _ip,
            success: function (result) {
                if (result.result == "ok") {
                    $('.subscriber.comment-data').trigger('comment.data', [result.comments]);
                }
                else {
                    $('.subscriber.comment-error').trigger('comment.error', [result.message]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
            }
        });
    }

    $('#btnCommentPost').click(function (evt) {
        var comment = $('#txtComment').val().trim();
        if (!comment) return;
        postComment(comment);
    });

    function postComment(comment) {
        $('.subscriber.comment-post-invoked').trigger('comment.post-invoked');
        $.ajax({
            dataType: "json",
            method: "POST",
            data: { comment: comment },
            url: '/comment-api/' + _ip,
            success: function (result) {
                if (result.result === "ok") {
                    $('.subscriber.comment-post').trigger('comment.post', [result.comment]);
                }
                else {
                    $('.subscriber.comment-error').trigger('comment.error', [result.message]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
            }
        });
    }

    //////////////////////////////
    // Comment list
    //////////////////////////////
    $('#commentList').on('comment.invoked', function (evt) {
        $('#commentPanel').fadeOut('fast');
    })
        .on('comment.data', function (evt, result) {
            var qCommentList = $(this);
            qCommentList.empty(); // remove all contents

            // COMMENT please use templating (e.g. mustache.js), don't put HTML inside JS code
            result.forEach(function (comment) {
                qCommentList.append(
                    '<li class="list-group-item">' +
                    '<h6 class="text-muted">' + comment.post_date + '</h6>' +
                    '<p>' + comment.comment + '</p>' +
                    '</li>'
                );
            });

            $('#commentPanel').delay(0).slideDown();
        })
        .on('comment.post', function (evt, comment) {
            // console.log('comment.post', result);
            $(this).append(
                '<li class="list-group-item">' +
                '<h6 class="text-muted">' + comment.post_date + '</h6>' +
                '<p>' + comment.comment + '</p>' +
                '</li>'
            );
        });

    //////////////////////////////
    // Comment POST form
    //////////////////////////////
    $('#commentForm').on('comment.post-invoked', function (evt) {
        $('#commentForm textarea, #commentForm button').prop('disabled', true);
    })
        .on('comment.post', function (evt, comment) {
            $('#commentForm textarea, #commentForm button').prop('disabled', false);
            if (comment.id) {
                $('#txtComment').val(''); // empty textarea
            }
        });

}); 