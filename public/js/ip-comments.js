$(function () {
    // https://stackoverflow.com/questions/399867/custom-events-in-jquery     
    
    var _ip = window.viewIp;
    ///////////////////////////////////////////////////
    // Comments for the IP address
    ///////////////////////////////////////////////////
    
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
                    $('.subscriber.comment-post').trigger('comment.post-ok', [result.comment]);
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
    $('#commentList')
        .on('comment.post-ok', function (evt, comment) {
            // convert date
            comment.post_date = (new Date(comment.post_date)).toString();

            // set up Mustache.js on templates - https://github.com/janl/mustache.js
            var commentTemplate = $('#commentTemplate').html();
            Mustache.parse(commentTemplate); 

            var commentHtml = Mustache.render(commentTemplate, comment);
            $(this).append(commentHtml);
        });

    //////////////////////////////
    // Comment POST form
    //////////////////////////////
    $('#commentForm')
        .on('comment.post-invoked', function (evt) {
            $('#commentForm textarea, #commentForm button').prop('disabled', true);
        })
        .on('comment.post-ok', function (evt, comment) {
            $('#commentForm textarea, #commentForm button').prop('disabled', false);
            if (comment.id) {
                $('#txtComment').val(''); // empty textarea
            }
        });

}); 