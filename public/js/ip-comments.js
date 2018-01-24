$(function () {
    // https://stackoverflow.com/questions/399867/custom-events-in-jquery     

    ///////////////////////////////////////////////////
    // Comments for the IP address
    ///////////////////////////////////////////////////
    $(document).on('iplookup.ipfetched', function (evt, ip, result) {
        $('#comments_title_ip').html(ip);
        //TODO: fetch comments from server (ajax)
        //TODO: show comments sections
        //TODO: saving and display new comment (ajax)

        $('#comment_panel').delay(0).slideDown();
    });

    $('#btnCommentPost').click(function(evt){
        var comment = $('#txtComment').val().trim();
        if (!comment) return;

        $('#commentForm textarea, #commentForm button').prop('disabled', true);
        console.log('comment', comment);
    });

}); 