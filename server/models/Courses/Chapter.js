var mongoose = require("mongoose");
const validator = require("validator");

var ChapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  desc: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  chapterImage: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: validator.isURL,
      message: "{VALUE} is not a valid URL!"
    }
  },
  fromCourse: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true
  },
  articles: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ArticleObject"
    }
  ],
  status: {
    type: String,
    required: false,
    trim: true,
    default: null
  }
});

ChapterSchema.statics.removeRefs = function(chapterId, cb) {
  this.model("Course")
    .updateMany({ $pull: { chapters: chapterId } }, cb)
    .exec();
};

var Chapter = mongoose.model("Chapter", ChapterSchema);
module.exports = { Chapter };
