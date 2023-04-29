var express = require("express");
var router = express.Router();

var articlesController = require("./../../controllers/vc4/articles-controller");
var testContentController = require("./../../controllers/vc4/test-content-controller");

//Post Article for editing
router.post("/ArticleObjects", articlesController.postArticleObjects);
//Get Draft Articles
router.get("/DraftArticles", articlesController.getDraftArticles);
//Get Article for editing
router.get("/ArticleObjects", articlesController.getArticleObjects);
//Send ArticleWebVersion
router.get("/ArticleObject", articlesController.articleObject);
//Send ArticleWebVersion
router.get("/ArticleObjectApp", articlesController.articleObjectWebView);
//Test ArticleWebVersion
router.get("/TestArticleObject", testContentController.testArticle);
//Test ArticleWebVersion
router.get("/TestArticleWebview", testContentController.testArticleWebView);
//Edit an ArticleObject
router.post("/EditArticleObject", articlesController.editArticle);
//Delete an article from the Database
router.post("/DeleteArticleObject", articlesController.deleteArticle);

module.exports = router;
