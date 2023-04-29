var striptags = require("striptags");

module.exports.setBookmarksAndLikes = function(ArticleObjects, user) {
  for (let i = 0; i < ArticleObjects.length; i++) {
    const article = ArticleObjects[i];
    ArticleObjects[i].liked = user.likedArticles.indexOf(article._id) != -1;
    ArticleObjects[i].bookmarked =
      user.savedArticles.indexOf(article._id) != -1;
    ArticleObjects[i].completed =
      user.completedArticles.indexOf(article._id) != -1;

    if (ArticleObjects[i].body.length >= 250)
      ArticleObjects[i].body = ArticleObjects[i].body.substring(0, 250);
    ArticleObjects[i].body = striptags(ArticleObjects[i].body);
    ArticleObjects[i].mediaObjects = null;
  }
  return ArticleObjects;
};

module.exports.prepareArticles = function(ArticleObjects) {
  for (let i = 0; i < ArticleObjects.length; i++) {
    if (ArticleObjects[i].type == "codebrink") ArticleObjects[i].body = "";
  }
  return ArticleObjects;
};
