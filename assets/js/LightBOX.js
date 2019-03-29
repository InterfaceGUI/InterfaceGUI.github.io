$(document).ready(function () {
    $("h3").append('<svg class="octiconh3" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg> ')
    $("h4").append('<svg class="octiconh4" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg> ')

});

function is_youtubelink(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}
function is_imagelink(url) {
    var p = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    return (url.match(p)) ? true : false;
}
function is_vimeolink(url, el) {
    var id = false;
    $.ajax({
        url: 'https://vimeo.com/api/oembed.json?url=' + url,
        async: true,
        success: function (response) {
            if (response.video_id) {
                id = response.video_id;
                $(el).addClass('lightbox-vimeo').attr('data-id', id);
            }
        }
    });
}

$(document).ready(function () {
    //add classes to links to be able to initiate lightboxes
    $("a").each(function () {
        var url = $(this).attr('href');
        if (url) {
            if (url.indexOf('vimeo') !== -1 && !$(this).hasClass('no-lightbox')) is_vimeolink(url, $(this));
            if (is_youtubelink(url) && !$(this).hasClass('no-lightbox')) $(this).addClass('lightbox-youtube').attr('data-id', is_youtubelink(url));
            if (is_imagelink(url) && !$(this).hasClass('no-lightbox')) {
                $(this).addClass('lightbox-image');
                var href = $(this).attr('href');
                var filename = href.split('/').pop();
                var split = filename.split(".");
                var name = split[0];
                $(this).attr('title', name);
            }
        }
    });
    //remove the clicked lightbox
    $("body").on("click", ".lightbox", function (event) {
        if ($(this).hasClass('gallery')) {
            $(this).remove();
            if ($(event.target).attr('id') == 'next') {
                //next item
                if ($("a.gallery.current").nextAll("a.gallery:first").length) $("a.gallery.current").nextAll("a.gallery:first").click();
                else $("a.gallery.current").parent().find("a.gallery").first().click();
            }
            else if ($(event.target).attr('id') == 'prev') {
                //prev item
                if ($("a.gallery.current").prevAll("a.gallery:first").length) $("a.gallery.current").prevAll("a.gallery:first").click();
                else $("a.gallery.current").parent().find("a.gallery").last().click();
            }
            else {
                $("a.gallery").removeClass('gallery');
            }
        }
        else $(this).remove();
    });
    //prevent image from being draggable (for swipe)
    $("body").on('dragstart', ".lightbox img", function (event) { event.preventDefault(); });
    //add the youtube lightbox on click
    $("a.lightbox-youtube").click(function (event) {
        event.preventDefault();
        $('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://www.youtube.com/embed/' + $(this).attr('data-id') + '?autoplay=1&showinfo=0&rel=0"></iframe></div></div></div>').appendTo('body');
    });
    //add the image lightbox on click
    $("a.lightbox-image").click(function (event) {
        event.preventDefault();
        $('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="img" style="background: url(' + $(this).attr('href') + ') center center / contain no-repeat;" title="' + $(this).attr('title') + '" ><img src="' + $(this).attr('href') + '" alt="' + $(this).attr('title') + '" /></div><span>' + $(this).attr('title') + '</span></div>').appendTo('body');
    });
    //add the vimeo lightbox on click
    $("body").on("click", "a.lightbox-vimeo", function (event) {
        event.preventDefault();
        $('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://player.vimeo.com/video/' + $(this).attr('data-id') + '/?autoplay=1&byline=0&title=0&portrait=0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div></div>').appendTo('body');
    });

    $("body").on("click", "a[class*='lightbox-']", function () {
        var link_elements = $(this).parent().find("a[class*='lightbox-']");
        $(link_elements).removeClass('current');
        for (var i = 0; i < link_elements.length; i++) {
            if ($(this).attr('href') == $(link_elements[i]).attr('href')) {
                $(link_elements[i]).addClass('current');
            }
        }
        if (link_elements.length > 1) {
            $('.lightbox').addClass('gallery');
            $(link_elements).addClass('gallery');
        }
    });


});
$('div.highlighter-rouge').each(function (index) {
    var codetype = $(this).attr('class').replace("highlighter-rouge", "").replace("language-", "").trim().toUpperCase()
    var hilite = $(this);
    hilite.wrap("<div class=\"highlight\"></div>");
    if (codetype) {
        hilite.before("<span class=\"codelabel\"> Code: <strong>" + codetype + "</strong> </span>");
    } else {
        hilite.before("<span class=\"codelabel\"> <strong>Code</strong> </span>");
    }
});
