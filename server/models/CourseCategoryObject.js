var mongoose = require("mongoose");

var CourseCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  imageURL: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  topics: {
    type: [
      {
        topic: {
          type: String,
          minlength: 1,
          trim: true
        },
        subtopics: {
          type: [
            {
              type: String,
              minlength: 1,
              trim: true
            }
          ]
        }
      }
    ]
  }
});

var CourseCategory = mongoose.model("CourseCategory", CourseCategorySchema);

module.exports = { CourseCategory };
