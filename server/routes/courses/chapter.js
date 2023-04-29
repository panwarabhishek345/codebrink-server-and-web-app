var express = require("express");
var router = express.Router();

const { authenticateGoogle } = require("./../../middleware/authenticate.js");
var chapterController = require("./../../controllers/courses/chapter");

//Get a Chapter
router.get("/GetChapter", chapterController.getChapter);
//Get all articles in a chapter
router.get("/GetChapterArticles", chapterController.getChapterArticles);
//Get all articles in a chapter
router.get("/GetChapterArticlesList", chapterController.getChapterArticlesList);
//Get all articles in a chapter with likes and bookmarks for google users
router.get(
  "/googleUser/GetChapterArticles",
  authenticateGoogle,
  chapterController.getChapterArticlesGoogle
);
//Get all Chapter
router.get("/GetAllChapters", chapterController.getAllChapters);
//Post a Chapter
router.post("/PostChapter", chapterController.postChapter);
//Delete a Chapter
router.post("/DeleteChapter", chapterController.deleteChapter);
//Add an article to a Chapter
router.post("/chapter/AddArticle", chapterController.addArticle);
//Delete an Article from a Chapter
router.post("/chapter/DeleteArticle", chapterController.deleteArticle);
//Delete all Articles from a Chapter
router.post("/chapter/DeleteAllArticles", chapterController.deleteAllArticles);

module.exports = router;
