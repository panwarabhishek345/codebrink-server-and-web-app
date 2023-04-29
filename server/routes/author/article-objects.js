var express = require("express");
var router = express.Router();

const {
  authenticateGoogleAuthor
} = require("./../../middleware/authenticate.js");
var articlesController = require("./../../controllers/author/article-objects");

//Post Article for editing
router.post(
  "/author/ArticleObjects",
  authenticateGoogleAuthor,
  articlesController.postArticleObjects
);
//Send Dashboard Page after login
router.get(
  "/author/Dashboard",
  authenticateGoogleAuthor,
  articlesController.getDashboard
);
// Get Articles written by the author
router.get(
  "/author/GetMyArticles",
  authenticateGoogleAuthor,
  articlesController.getMyArticles
);
//Open Editor to edit the article
router.get(
  "/author/editor",
  authenticateGoogleAuthor,
  articlesController.openEditor
);
//Edit an ArticleObject
router.post(
  "/author/EditArticleObject",
  authenticateGoogleAuthor,
  articlesController.editArticle
);
//Delete an article from the Database
router.post(
  "/author/DeleteArticleObject",
  authenticateGoogleAuthor,
  articlesController.deleteArticle
);
//Post and article for review
router.post(
  "/author/PostArticleForReview",
  authenticateGoogleAuthor,
  articlesController.postArticleForReview
);
//Cancel the review request
router.post(
  "/author/CancelReviewRequest",
  authenticateGoogleAuthor,
  articlesController.cancelReviewRequest
);
module.exports = router;
