var express = require("express");
var router = express.Router();

const {
  authenticateGoogleAdmin
} = require("./../../middleware/authenticate.js");
var articlesController = require("./../../controllers/admin/article-objects");

// //Post Article for editing
// router.post("/admin/ArticleObjects", authenticateGoogleAdmin, articlesController.postArticleObjects);
//Send Dashboard Page after login
router.get(
  "/admin/Dashboard",
  authenticateGoogleAdmin,
  articlesController.getDashboard
);
// Get Articles written by the authors
router.get(
  "/admin/GetAllArticles",
  authenticateGoogleAdmin,
  articlesController.getAllArticles
);
//Open Editor to edit the article
router.get(
  "/admin/editor",
  authenticateGoogleAdmin,
  articlesController.openEditor
);
//get search articles
router.get(
  "/admin/SearchArticles",
  authenticateGoogleAdmin,
  articlesController.searchArticles
);
//Edit an ArticleObject
router.post(
  "/admin/EditArticleObject",
  authenticateGoogleAdmin,
  articlesController.editArticle
);
//Delete an article
router.post(
  "/admin/DeleteArticleObject",
  authenticateGoogleAdmin,
  articlesController.deleteArticle
);
// deleteArticlesByTopic
router.post(
  "/admin/deleteArticlesByTopic",
  articlesController.deleteArticlesByTopic
);

//Publish the Aricle
router.post(
  "/admin/PublishArticle",
  authenticateGoogleAdmin,
  articlesController.publishArticle
);
//Reject the Aricle
router.post(
  "/admin/RejectArticle",
  authenticateGoogleAdmin,
  articlesController.rejectArticle
);
//Cancel the review request
router.post(
  "/admin/CancelReviewRequest",
  authenticateGoogleAdmin,
  articlesController.cancelReviewRequest
);

module.exports = router;
