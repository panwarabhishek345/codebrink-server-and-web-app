var express = require("express");
var router = express.Router();

const { authenticateGoogle } = require("./../../../middleware/authenticate.js");
var chapterController = require("./../../../controllers/vc4/courses/chapter");

//Get all articles in a chapter
router.get("/GetChapterArticles", chapterController.getChapterArticles);
//Get all articles in a chapter with likes and bookmarks for google users
router.get(
  "/googleUser/GetChapterArticles",
  authenticateGoogle,
  chapterController.getChapterArticlesGoogle
);

module.exports = router;
