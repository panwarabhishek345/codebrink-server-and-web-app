"use strict";

// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};

firebase.initializeApp(config);


$(window).bind('keydown', function (event) {

    if (event.key === "Escape") { // escape key maps to keycode `27`
        event.preventDefault();
        getAllArticles();
    }
    else if (event.ctrlKey || event.metaKey) {

        if (String.fromCharCode(event.which).toLowerCase() == 's') {
            event.preventDefault();
            editArticle();
            return;
        }

        if (String.fromCharCode(event.which).toLowerCase() == 'd') {
            event.preventDefault();
            viewArticle('from_editor');
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


function breakText() {
    editor.session.insert(editor.getCursorPosition(), "<br>");
    editor.focus();
}

function horizontalRuleText() {
    editor.session.insert(editor.getCursorPosition(), "<hr>");
    editor.focus();
}


function tableText() {
    editor.session.insert(editor.getCursorPosition(), "<table id=\"table-normal\">\n<tbody>\n<tr>\n\t<th></th>\n\t<th></th>\n</tr>\n<tr>\n\t<td></td>\n\t<td></td>\n</tr>\n</tbody>\n</table>");
    editor.focus();
}

function h2Text() {
    editor.session.replace(editor.selection.getRange(), "<h2>" + editor.getSelectedText() + "</h2>");
    editor.focus(); //To focus the ace editor
}

function h3Text() {
    editor.session.replace(editor.selection.getRange(), "<h3>" + editor.getSelectedText() + "</h3>");
    editor.focus();
}

function h4Text() {
    editor.session.replace(editor.selection.getRange(), "<h4>" + editor.getSelectedText() + "</h4>");
    editor.focus();
}

function h5Text() {
    editor.session.replace(editor.selection.getRange(), "<h5>" + editor.getSelectedText() + "</h5>");
    editor.focus();
}

function highlightText() {
    editor.session.replace(editor.selection.getRange(), "<span class=\"highlighted-text\">" + editor.getSelectedText() + "</span>");
    editor.focus();
}

function boldText() {
    editor.session.replace(editor.selection.getRange(), "<b>" + editor.getSelectedText() + "</b>");
    editor.focus(); //To focus the ace editor
}

function italicText() {
    editor.session.replace(editor.selection.getRange(), "<i>" + editor.getSelectedText() + "</i>");
    editor.focus();

}

function underlineText() {
    editor.session.replace(editor.selection.getRange(), "<u>" + editor.getSelectedText() + "</u>");
    editor.focus();

}

function codeText() {
    editor.session.replace(editor.selection.getRange(), "<code class=\"inline-code\">" + editor.getSelectedText() + "</code>");
    editor.focus();
}

function olText() {
    editor.session.replace(editor.selection.getRange(), "<ol>" + editor.getSelectedText() + "</ol>");
    editor.focus();
}

function ulText() {
    editor.session.replace(editor.selection.getRange(), "<ul>" + editor.getSelectedText() + "</ul>");
    editor.focus();
}

function liText() {
    editor.session.replace(editor.selection.getRange(), "<li>" + editor.getSelectedText() + "</li>");
    editor.focus();
}

function lessThanText() {
    editor.session.insert(editor.getCursorPosition(), "&lt;");
    editor.focus();
}

function greaterThanText() {
    editor.session.insert(editor.getCursorPosition(), "&gt;");
    editor.focus();
}

function addImage() {
    var iMOString = "<div class=\"media-object\" type=\"image\" src=\"\"></div>";
    editor.session.insert(editor.getCursorPosition(), iMOString);
    editor.focus();
}

function addCode() {
    var cMOString = "<xmp class=\"media-object\" type=\"code\" language=\"\" full-screen-enable=\"\">\n // You code goes here. \n</xmp>";
    editor.session.insert(editor.getCursorPosition(), cMOString);
    editor.focus();
}

function addWeb() {
    var wMOString = "<xmp class=\"media-object\" type=\"web\" full-screen-enable=\"\">\n// Your html goes here.\n</xmp>";
    editor.session.insert(editor.getCursorPosition(), wMOString);
    editor.focus();
}

function addPreText() {
    var ptMOString = "<xmp class=\"media-object\" type=\"pre-text\" full-screen-enable=\"\">\n// Your text goes here.\n</xmp>";
    editor.session.insert(editor.getCursorPosition(), ptMOString);
    editor.focus();
}



function toggleFullScreen() {
    editor.container.requestFullscreen();
}

function getAllArticles() {

    setPage(null, "all-articles");

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {

        const Http = new XMLHttpRequest();
        const url = '/admin/GetAllArticles';
        Http.open("GET", url);
        Http.setRequestHeader('Content-Type', 'application/json');
        Http.setRequestHeader('IDToken', idToken);

        showLoader(true);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                $("#page-container").html(Http.responseText);
            }
            else if (Http.readyState == 4) {
                console.log("Articles Fetching Error!");
            }
            showLoader(false);
        }

    }).catch(function (error) {
        console.log(error);
        showNormalToast(error);
        return error;
    });
}

function fetchPage(reqPage) {

    setPage(null, "all-articles");
    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {


        const Http = new XMLHttpRequest();
        const url = '/admin/GetAllArticles';
        Http.open("GET", url);
        Http.setRequestHeader('Content-Type', 'application/json');
        Http.setRequestHeader('IDToken', idToken);
        let reqNext, reqPrev;
        if (reqPage == 'prev') {
            reqPrev = document.getElementById("articles-list").firstElementChild.firstElementChild.getAttribute('data-created-at');
            Http.setRequestHeader('reqPrev', reqPrev);
        }
        else {
            reqNext = document.getElementById("articles-list").lastElementChild.firstElementChild.getAttribute('data-created-at');
            Http.setRequestHeader('reqNext', reqNext);
        }
        showLoader(true);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                $("#page-container").html(Http.responseText);
            }
            else if (Http.readyState == 4) {
                console.log("Articles Fetching Error!");
            }
            showLoader(false);
        }

    }).catch(function (error) {
        console.log(error);
        showNormalToast(error);
        return error;
    });

}

function searchArticles() {

    let query = document.getElementById('search-box').value;
    if (!query)
        return;

    setPage(null, "all-articles");
    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {

        const Http = new XMLHttpRequest();
        const url = '/admin/SearchArticles';
        Http.open("GET", url);
        Http.setRequestHeader('Content-Type', 'application/json');
        Http.setRequestHeader('IDToken', idToken);
        Http.setRequestHeader('query', query);
        showLoader(true);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                $("#page-container").html(Http.responseText);
            }
            else if (Http.readyState == 4) {
                console.log("Search Articles Fetching Error!" + Http.responseText);
                showNormalToast("Search Articles Fetching Error!" + Http.responseText);
            }
            showLoader(false);
        }

    }).catch(function (error) {
        console.log(error);
        showNormalToast(error);
        return error;
    });

}


function viewArticle(articleid) {
    console.log("viewed");
    if (articleid === 'from_editor') {
        var articleString = getLocalArticle();
        var articleObject = JSON.parse(articleString);
        if (articleObject) {
            var win = window.open('/TestArticleWebview?id=' + articleObject._id, 'preview_window');
            win.focus();
        }
        else
            showNormalToast('Please create the article first.')
        return;
    }
    var win = window.open('/TestArticleWebview?id=' + articleid, '_blank');
    win.focus();
}


function rejectArticle(articleid) {

    if (articleid === 'from_editor') {
        var articleString = getLocalArticle();
        var articleObject = JSON.parse(articleString);
        articleid = articleObject._id
    }
    if (!articleid)
        return showNormalToast('Please Specify the Article Id!');
    else {
        var answer = confirm("Are you sure you want to Reject this article?");
        if (answer == false)
            return;
    }

    const url = '/admin/RejectArticle?id=' + articleid;

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                getAllArticles();
                showNormalToast('Article has been rejected.');
            }
            else if (xhr.readyState > 3) {
                console.log(xhr.responseText);
                showNormalToast(xhr.responseText);
            }
            showLoader(false);

        };

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('IDToken', idToken);
        xhr.send("");
        showLoader(true);
        return xhr;
    }).catch(function (error) {
        console.log(error);
        return error;
    });
}


function publishArticle(articleid) {

    if (articleid === 'from_editor') {
        var articleString = getLocalArticle();
        var articleObject = JSON.parse(articleString);
        articleid = articleObject._id
    }


    if (!articleid)
        return showNormalToast('Please Specify the Article Id!');
    else {
        var answer = confirm("Are you sure you want to Publish this article?");
        if (answer == false)
            return;
    }

    const url = '/admin/PublishArticle?id=' + articleid;

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                getAllArticles();
                showNormalToast('Article has been published.');
            }
            else if (xhr.readyState > 3) {
                console.log(xhr.responseText);
                showNormalToast(xhr.responseText);
            }
            showLoader(false);

        };

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('IDToken', idToken);
        xhr.send("");
        showLoader(true);
        return xhr;
    }).catch(function (error) {
        console.log(error);
        return error;
    });
}

function deleteArticle(articleid) {

    if (!articleid)
        return showNormalToast('Please Specify the Article Id!');
    else {
        var answer = confirm("Are you sure you want to delete this article?");
        if (answer == false)
            return;
    }

    const url = '/admin/DeleteArticleObject?id=' + articleid;

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                document.getElementById(articleid).remove();
                showNormalToast('Article deleted successfully.');
            }
            else if (xhr.readyState > 3) {
                console.log(xhr.responseText);
                showNormalToast(xhr.responseText);
            }
            showLoader(false);

        };

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('IDToken', idToken);
        xhr.send("");
        showLoader(true);
        return xhr;
    }).catch(function (error) {
        console.log(error);
        return error;
    });
}

function cancelReviewRequest(articleid) {

    if (!articleid)
        return showNormalToast('Please Specify the Article Id!');
    else {
        var answer = confirm("Are you sure you want to Cancel review request this article?");
        if (answer == false)
            return;
    }

    showLoader(true);
    const url = '/admin/CancelReviewRequest?id=' + articleid;

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                getAllArticles();
                showNormalToast('Successfully cancelled the review request.');
            }
            else if (xhr.readyState > 3) {
                console.log(xhr.responseText);
                showNormalToast(xhr.responseText);
            }
            showLoader(false);

        };

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('IDToken', idToken);
        xhr.send("");
        return xhr;
    }).catch(function (error) {
        console.log(error);
        return error;
    });
}



function openEditor(article) {

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        showLoader(true);
        setPage(JSON.stringify(article), "article-editor");
        const Http = new XMLHttpRequest();
        const url = '/admin/editor';
        Http.open("GET", url);
        Http.setRequestHeader('Content-Type', 'application/json');
        Http.setRequestHeader('IDToken', idToken);

        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                $("#page-container").html(Http.responseText);
            }
            else if (Http.readyState == 4) {
                console.log("Editor Fetching Error!");
            }
            showLoader(false);
        }

    }).catch(function (error) {
        console.log(error);
        showNormalToast(error);
        return error;
    });
}






function getArticle() {
    var articleString = getLocalArticle();
    inflateArticle(articleString);
}

function getLocalArticle() {
    return localStorage.getItem('edit-article');
}

function inflateArticle(articleString) {

    var articleParsed = JSON.parse(articleString);


    document.getElementById("titleInput").value = articleParsed.title;
    document.getElementById("topicInput").value = articleParsed.topic;
    document.getElementById("subtopicInput").value = articleParsed.subtopic;
    
    console.log(articleParsed.type);
    var webtypeButton = document.getElementById("webtype");
    var codebrinktypeButton = document.getElementById("codebrinktype");

    if(articleParsed.type == 'web'){
        webtypeButton.checked = true;
        codebrinktypeButton.checked = false;
    }
    else{
        webtypeButton.checked = false;
        codebrinktypeButton.checked = true;
    }

    webtypeButton.addEventListener("click",function(){
        console.log("webtypeButton " + webtypeButton.checked);
        codebrinktypeButton.checked = false;
    });
    codebrinktypeButton.addEventListener("click",function(){
        console.log("codebrinktypeButton " + codebrinktypeButton.checked);
        webtypeButton.checked = false;
    });



    document.getElementById("tagsInput").value = articleParsed.tags;
    if (articleParsed.articleImage != "null" && articleParsed.articleImage != undefined)
        document.getElementById("articleImageInput").value = articleParsed.articleImage;

    editor.setValue(getArticleBodyWithMO(articleParsed));
    editor.clearSelection(); // This will remove the highlight over the text
    setPage(JSON.stringify(articleParsed), "article-editor");

}

function getArticleBodyWithMO(article) {

    var body = article.body;
    var mediaObjects = article.mediaObjects;

    var i = 0;
    while (body.includes("%%"))
        body = body.replace("%%", getStringFromMO(mediaObjects[i++]));

    return body;

}

function getStringFromMO(mo) {

    if(!mo)
        return;
    switch (mo.objectType) {
        case 0:
            var lang = mo.content;
            var isFullScreenEnabled = mo.isFullScreenEnabled;
            var code = mo.codeCpp;
            return "<xmp class=\"media-object\" type=\"code\" language=\"" + lang + "\" full-screen-enable=\"" + isFullScreenEnabled + "\">\n" + code + "\n</xmp>";

        case 2:
            var isFullScreenEnabled = mo.isFullScreenEnabled;
            var preText = mo.content;
            return "<xmp class=\"media-object\" type=\"pre-text\" full-screen-enable=\"" + isFullScreenEnabled + "\">\n" + preText + "\n</xmp>";

        case 1:
            var src = mo.content;
            return "<div class=\"media-object\" type=\"image\" src=\"" + src + "\"></div>";

        case 3:
            var html = mo.content;
            var isFullScreenEnabled = mo.isFullScreenEnabled;
            return "<xmp class=\"media-object\" type=\"web\" full-screen-enable=\"" + isFullScreenEnabled + "\">\n" + html + "\n</xmp>";

        default: showNormalToast("Wrong Media Object Type!");
            break;
    }
}


function editArticle() {
    showLoader(true);
    var article = getEditedArticle();
    if (article === null) {
        showNormalToast("Error: Null Edited article.")
        showLoader(false);
        return;
    }
    postEditedArticle(article);
}

function getEditedArticle() {

    var articleString = localStorage.getItem('edit-article');
    var articleEdited = JSON.parse(articleString);
    articleEdited.title = document.getElementById("titleInput").value;
    articleEdited.body = editor.getValue();
    articleEdited.topic = document.getElementById("topicInput").value;
    articleEdited.subtopic = document.getElementById("subtopicInput").value;
    
    console.log("edited " + document.getElementById("webtype").checked);

    if(document.getElementById("webtype").checked)
        articleEdited.type = "web";
    else
        articleEdited.type = "codebrink";

    articleEdited.tags = document.getElementById("tagsInput").value;

    var articleImage = document.getElementById("articleImageInput").value;
    if (articleImage && articleImage.length > 0) {
        articleEdited.articleImage = articleImage;
    }
    else {
        delete articleEdited.articleImage;
    }

    var done = parseMediaObjects(articleEdited);
    if (done === null) {
        return null;
    }

    localStorage.setItem('edit-article', JSON.stringify(articleEdited));
    return articleEdited;
}


// it parses the mediaobjects from the body and adds them to the mediaobjects array
function parseMediaObjects(article) {

    var mediaObjects = [];
    var bodyHtml = "<div id=\"root-body\">" + article.body + "</div>";
    var doc = new DOMParser().parseFromString(bodyHtml, "text/html");
    var rootEl = doc.body.firstChild;
    var x = doc.querySelectorAll(".media-object");

    for (var i = 0; i < x.length; i++) {
        var mo = x.item(i);
        $(doc).find(mo).replaceWith('%%');
        var mediaObject = getmoJSON(mo);
        if (mediaObject === null)
            return null;
        else
            mediaObjects.push(mediaObject);

    }
    article.body = rootEl.innerHTML;
    article.mediaObjects = mediaObjects;
    return true;
}

function getmoJSON(mo) {
    console.log(mo.getAttribute("type"));

    switch (mo.getAttribute("type")) {
        case "code":

            var lang = mo.getAttribute("language");
            var isFullScreenEnabled = mo.getAttribute("full-screen-enable");
            var code = mo.innerText;

            console.dir(mo);

            if (!lang) {
                showNormalToast("Empty Language field in Code");
                return null;
            }
            if (!isFullScreenEnabled) {
                showNormalToast("Empty full-screen-enable field");
                return null;
            }
            if (!code) {
                showNormalToast("Please add code.");
                return null;
            }

            return {
                objectType: 0,
                content: lang,
                height: -1,
                isFullScreenEnabled: isFullScreenEnabled,
                codeCpp: code
            }

        case "image":
            var src = mo.getAttribute("src");
            if (!src) {
                showNormalToast("Empty src field in Image");
                return null;
            }
            return {
                objectType: 1,
                content: src,
                height: -1,
                isFullScreenEnabled: false
            }

        case "pre-text":

            var isFullScreenEnabled = mo.getAttribute("full-screen-enable");
            var preText = mo.innerText;

            if (!isFullScreenEnabled) {
                showNormalToast("Empty full-screen-enable field");
                return null;
            }
            if (!preText) {
                showNormalToast("Please add some text int the pre tags.");
                return null;
            }
            return {
                objectType: 2,
                content: preText,
                height: -1,
                isFullScreenEnabled: isFullScreenEnabled,
            }
        case "web":
            var html = mo.innerHTML;
            var isFullScreenEnabled = mo.getAttribute("full-screen-enable");
            if (!html) {
                showNormalToast("Please add some HTML content to the MediaObject");
                return null;
            }
            if (!isFullScreenEnabled) {
                showNormalToast("Empty full-screen-enable field");
                return null;
            }
            return {
                objectType: 3,
                content: html,
                height: -1,
                isFullScreenEnabled: isFullScreenEnabled,
            }

        default: showNormalToast("Wrong Media Object Type!");
            return null;
    }
}



function postEditedArticle(article) {

    var data = JSON.stringify(article);
    var url = "/admin/EditArticleObject";

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var params = typeof data == 'string' ? data : Object.keys(data).map(
            function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                inflateArticle(xhr.responseText);
                showNormalToast('Article Saved.');
            }
            else if (xhr.readyState > 3) {
                showNormalToast("Some error Occurred: " + xhr.responseText);
            }
            showLoader(false);
        };

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('IDToken', idToken);
        xhr.send(params);
        return xhr;

    }).catch(function (error) {
        console.log(error);
        showNormalToast("Some error Occurred: " + error);
        return error;
    });
}




function showNormalToast(text) {
    $.toast({
        text: text,
        loader: true,
        loaderBg: '#F76C66',
        position: 'bottom-right',
        bgColor: '#323439',
        hideAfter: 10000,
        showHideTransition: 'slide'
    });
}

function showLoader(show) {
    if (show)
        document.getElementById('progressbar').style.display = 'block';
    else
        document.getElementById('progressbar').style.display = 'none';
}

function setPage(article, page) {
    localStorage.setItem('edit-article', article);
    localStorage.setItem('page', page);
}


function darkMode() {

    if (localStorage.getItem('darkMode') == "true") {
        localStorage.setItem("darkMode", "false");
        editor.setTheme("ace/theme/chrome");
    }
    else {
        localStorage.setItem("darkMode", "true");
        editor.setTheme("ace/theme/monokai");
    }

}

