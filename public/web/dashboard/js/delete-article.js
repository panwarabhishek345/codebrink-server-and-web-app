function deleteArticle(articleid) {

    if (!articleid)
        return showNormalToast('Please Specify the Article Id!');
    else {
        var answer = confirm("Are you sure you want to delete this article?");
        if (answer == false)
            return;
    }
    const url = '/author/DeleteArticleObject?id=' + articleid;

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
        showLoader(true);
        xhr.send("");
        return xhr;
    }).catch(function (error) {
        console.log(error);
        return error;
    });
}
