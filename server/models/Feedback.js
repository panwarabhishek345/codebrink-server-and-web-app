var mongoose = require("mongoose");

var FeedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var FeedbackObject = mongoose.model("FeedbackObject", FeedbackSchema);
module.exports = { FeedbackObject };
