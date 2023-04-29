"use strict"

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


function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = "/";
        document.getElementById("home-container").style.display = "block";
    }, function (error) {
        window.location.href = "/";
        document.getElementById("home-container").style.display = "block";
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

function getArticle() {
    var articleString = getLocalArticle();
    inflateArticle(articleString);
}

function inflateArticle(articleString) {

    var articleParsed = JSON.parse(articleString);

    if (!articleParsed) {
        document.getElementById("create-article-btn").style.display = "block";
        document.getElementById("view-article-btn").style.display = "none";
        document.getElementById("save-article-btn").style.display = "none";
        document.getElementById("review-article-btn").style.display = "none";
        return;
    }
    else {
        if (articleParsed.status == "published" || articleParsed.status == "under_review") {
            showNormalToast("Published or articles under review can\'t be edited.")
            getMyArticles();
        }
        else {
            document.getElementById("create-article-btn").style.display = "none";
            document.getElementById("view-article-btn").style.display = "block";
            document.getElementById("save-article-btn").style.display = "block";
            if (articleParsed.status != "rejected")
                document.getElementById("review-article-btn").style.display = "block";
            else
                document.getElementById("review-article-btn").style.display = "none";
        }


    }

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

    switch (mo.objectType) {
        case 0:
            var lang = mo.content;
            var isFullScreenEnabled = mo.isFullScreenEnabled;
            var code = mo.codeCpp;
            return "<xmp class=\"media-object\" type=\"code\" language=\"" + lang + "\" full-screen-enable=\"" + isFullScreenEnabled + "\">\n" + code + "\n</xmp>";

        case 1:
            var src = mo.content;
            return "<div class=\"media-object\" type=\"image\" src=\"" + src + "\"></div>";

        case 2:
            var isFullScreenEnabled = mo.isFullScreenEnabled;
            var preText = mo.content;
            return "<xmp class=\"media-object\" type=\"pre-text\" full-screen-enable=\"" + isFullScreenEnabled + "\">\n" + preText + "\n</xmp>";

        case 3:
            var html = mo.content;
            var isFullScreenEnabled = mo.isFullScreenEnabled;
            return "<xmp class=\"media-object\" type=\"web\" full-screen-enable=\"" + isFullScreenEnabled + "\">\n" + html + "\n</xmp>";

        default: showNormalToast("Wrong Media Object Type!");
            break;
    }
}



function openEditor(article) {



    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        showLoader(true);
        setPage(JSON.stringify(article), "article-editor");
        const Http = new XMLHttpRequest();
        const url = '/author/editor';
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


function getMyArticles() {

    setPage(null, "my-articles");

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {

        const Http = new XMLHttpRequest();
        const url = '/author/GetMyArticles';
        Http.open("GET", url);
        Http.setRequestHeader('Content-Type', 'application/json');
        Http.setRequestHeader('IDToken', idToken);

        Http.send();
        showLoader(true);
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                $("#page-container").html(Http.responseText);
            }
            else if (Http.readyState == 4) {
                console.log("My Articles Fetching Error!");
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

function getPage() {
    return localStorage.getItem('page');
}

function getLocalArticle() {
    return localStorage.getItem('edit-article');
}

function setPage(article, page) {
    localStorage.setItem('edit-article', article);
    localStorage.setItem('page', page);
}




function sendArticleForReview() {
    var article = getEditedArticle();
    if (article === null)
        return;
    postArticleForReview(article);

}

function postArticleForReview(article) {

    showLoader(true);

    var data = JSON.stringify(article);
    var url = "/author/PostArticleForReview";

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var params = typeof data == 'string' ? data : Object.keys(data).map(
            function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                getMyArticles();
                showNormalToast('Sent the article for review');
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

function cancelReviewRequest(articleid) {

    if (!articleid)
        return showNormalToast('Please Specify the Article Id!');

    showLoader(true);
    const url = '/author/CancelReviewRequest?id=' + articleid;

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                getMyArticles();
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


function showLoader(show) {
    if (show)
        document.getElementById('progressbar').style.display = 'block';
    else
        document.getElementById('progressbar').style.display = 'none';
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




