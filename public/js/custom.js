jQuery(document).ready(function ($) {
    $('.nav-link').click(function() {
        let hash = $(this).attr("data-tab");
        if(hash) window.location.hash = $(this).attr("data-tab");
    });

    if(window.location.hash) {
        let url = (window.location.hash + "-tab");
        console.log(url);
        $(url).trigger('click');
    }

    function locationHashChanged() {
        let url = (window.location.hash + "-tab");
        console.log(url);
        $(url).trigger('click');
    }

    window.addEventListener('hashchange', locationHashChanged, false);
})