var express = require("express");
const _ = require("lodash");

var router = express.Router();

const { authenticateGoogle } = require("./../middleware/authenticate.js");
var googleUserDataController = require("./../controllers/google-user-data-controller");

//User saving an article
router.post(
  "/Users/googleUser/bookmark",
  authenticateGoogle,
  googleUserDataController.postUserBookmark
);

//User liking an article
router.post(
  "/Users/googleUser/like",
  authenticateGoogle,
  googleUserDataController.postUserLike
);

//User Completed an article
router.post(
  "/Users/googleUser/complete",
  authenticateGoogle,
  googleUserDataController.postUserComplete
);

//Fetching all the bookmarked articles
router.get(
  "/Users/googleUser/BookmarkedArticles",
  authenticateGoogle,
  googleUserDataController.userBookmarkedArticles
);

module.exports = router;
