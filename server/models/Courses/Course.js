var mongoose = require("mongoose");
const validator = require("validator");

var CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  courseImage: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: validator.isURL,
      message: "{VALUE} is not a valid URL!"
    }
  },
  chapters: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Chapter"
    }
  ],
  status: {
    type: String,
    required: false,
    trim: true,
    default: null
  },
  tags: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  rating: {
    type: Number,
    default: 0
  }
});

CourseSchema.index(
  {
    name: "text",
    tags: "text"
  },
  {
    name: "My text index",
    weights: { name: 10, tags: 8 }
  }
);

CourseSchema.statics.removeRefs = function(courseId, cb) {
  this.model("CourseCategory")
    .updateMany({ $pull: { courses: courseId } }, cb)
    .exec();
};

var Course = mongoose.model("Course", CourseSchema);
module.exports = { Course };
