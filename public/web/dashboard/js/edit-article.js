"use strict";

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
    articleEdited.tags = document.getElementById("tagsInput").value;

    console.log("edited " + document.getElementById("webtype").checked);

    if(document.getElementById("webtype").checked)
        articleEdited.type = "web";
    else
        articleEdited.type = "codebrink";

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
    var url = "/author/EditArticleObject";

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

