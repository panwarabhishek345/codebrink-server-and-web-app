var express = require("express");
var router = express.Router();

var feedbackController = require("./../controllers/feedback-controller");

//Get a FeedbackObject
router.get("/FeedbackObjects", feedbackController.getFeedbackObjects);
//Post a FeedbackObject
router.post("/FeedbackObjects", feedbackController.postFeedbackObjects);

module.exports = router;
