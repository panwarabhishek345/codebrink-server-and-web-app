var express = require("express");
var router = express.Router();
var authorAuthController = require("./../../controllers/author/auth");
const {
  authenticateGoogleAuthor
} = require("./../../middleware/authenticate.js");

router.get("/author/tutorial", authorAuthController.sendTutorialPage);

router.post(
  "/author",
  authenticateGoogleAuthor,
  authorAuthController.sendDashboard
);

module.exports = router;
