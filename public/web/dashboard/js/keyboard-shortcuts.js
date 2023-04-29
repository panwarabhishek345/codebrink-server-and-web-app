$(window).bind('keydown', function (event) {

    if (event.key === "Escape") { // escape key maps to keycode `27`
        event.preventDefault();
        getMyArticles();
    }
    else if (event.ctrlKey || event.metaKey) {

        if (String.fromCharCode(event.which).toLowerCase() == 's') {
            event.preventDefault();
            editArticle();
            return;
        }

        if (event.shiftKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 'h':
                    event.preventDefault();
                    highlightText();
                    break;
                case 'b':
                    event.preventDefault();
                    boldText();
                    break;
                case 'i':
                    event.preventDefault();
                    italicText();
                    break;
                case 'u':
                    event.preventDefault();
                    underlineText();
                    break;
                case 'x':
                    event.preventDefault();
                    breakText();
                    break;
            }
        }
    }
});