$(function () {
    // https://stackoverflow.com/questions/399867/custom-events-in-jquery     

    var _ip;
    ///////////////////////////////////////////////////
    // Comments for the IP address
    ///////////////////////////////////////////////////
    $(document).on('iplookup.ipfetched', function (evt, ip, result) {
        $('#comments_title_ip').html(ip);
        _ip = ip;
        //fetch comments from server (ajax)
        fetchComments();
        //TODO: show comments sections
        //TODO: saving and display new comment (ajax)
    });

    function fetchComments() {
        $('.subscriber.comment-invoked').trigger('comment.invoked');
        $.ajax({
            dataType: "json",
            url: '/comment-api/'+_ip,
            success: function (result) {
                $('.subscriber.comment-data').trigger('comment.data', [result]);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
            }
        });
    }

    $('#btnCommentPost').click(function(evt){
        var comment = $('#txtComment').val().trim();
        if (!comment) return;

        postComment(comment);
    });

    function postComment(comment){
        $('.subscriber.comment-post-invoked').trigger('comment.post-invoked');
        $.ajax({
            dataType: "json",
            method: "POST",
            data: {comment: comment},
            url: '/comment-api/'+_ip,
            success: function (result) {
                $('.subscriber.comment-post').trigger('comment.post', [result]);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
            }
        });
    }

    //////////////////////////////
    // Comment list
    //////////////////////////////
    $('#commentList').on('comment.invoked', function(evt){
        $('#comment_panel').fadeOut('fast');
    })
    .on('comment.data', function(evt, result){
        
        $('#comment_panel').delay(0).slideDown();
    });
    
    //////////////////////////////
    // Comment POST form
    //////////////////////////////
    $('#commentForm').on('comment.post-invoked', function(evt){
        $('#commentForm textarea, #commentForm button').prop('disabled', true);
    })
    .on('comment.post', function(evt, result){
        $('#commentForm textarea, #commentForm button').prop('disabled', false);
        if (result.result == 'ok') {
            $('#txtComment').val(''); // empty textarea
        }
    });

}); 