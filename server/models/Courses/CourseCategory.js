var mongoose = require("mongoose");
const validator = require("validator");

var CourseCategorySchema = new mongoose.Schema({
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
  courseCategoryImage: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: validator.isURL,
      message: "{VALUE} is not a valid URL!"
    }
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course"
    }
  ]
});

var CourseCategory = mongoose.model("CourseCategory", CourseCategorySchema);

module.exports = { CourseCategory };
