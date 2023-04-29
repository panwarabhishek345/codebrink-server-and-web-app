"use strict"
function createArticle() {

    showLoader(true);
    var article = getNewArticle();
    if (article === null)
        return;
    postNewArticle(article);

}

function postNewArticle(article) {


    var url = "/author/ArticleObjects";
    var data = JSON.stringify(article);
    console.log(data);

    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
        var params = typeof data == 'string' ? data : Object.keys(data).map(
            function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                inflateArticle(xhr.responseText);
                showNormalToast("Successfully created a new article")
            }
            else if (xhr.readyState > 3) {
                showNormalToast(xhr.responseText);
            }
            showLoader(false);

        };

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('IDToken', idToken);
        xhr.send(params);
        return xhr;

    }).catch(function (error) {
        console.log(error);
        return error;
    });



}

function getNewArticle() {
    var titleInput = document.getElementById("titleInput").value;
    var bodyInput = editor.getValue();
    var topicInput = document.getElementById("topicInput").value;
    var subtopicInput = document.getElementById("subtopicInput").value;
    
    var type = "web";
    if(document.getElementById("webtype").checked)
        type = "web";
    else
        type = "codebrink";

    var tagsInput = document.getElementById("tagsInput").value;
    var articleImageInput = document.getElementById("articleImageInput").value;
    var article = new ArticleObject(titleInput, bodyInput, null, topicInput, subtopicInput, tagsInput, null, articleImageInput, null,type);
    var done = parseMediaObjects(article);
    if (done === null) {
        return null;
    }
    localStorage.setItem('edit-article', JSON.stringify(article));
    return article;
}
