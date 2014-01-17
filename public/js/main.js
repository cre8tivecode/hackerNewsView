$(function() {
    $('.list-group-item').on('click', function() {
        var title = $(this).attr('data-title'),
            url = $(this).attr('data-url');
        $('.modal-title').text(title);
        $('#content').attr('src', url);
    });
    $('.close').on('click', function() {
        $('#content').attr('src', '');
    });
});