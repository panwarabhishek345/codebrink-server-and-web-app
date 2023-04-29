var mongoose = require("mongoose");
const validator = require("validator");

var AuthorObjectSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email!"
    }
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user"
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  // Only Verified Authors can login to the admin area
  verified: {
    type: Boolean,
    default: false
  },
  profileURL: {
    type: String,
    minlength: 1,
    trim: true
  },
  imageURL: {
    type: String,
    minlength: 1,
    trim: true
  },
  myArticles: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ArticleObject"
    }
  ]
});

var AuthorObject = mongoose.model("AuthorObject", AuthorObjectSchema);
module.exports = { AuthorObject };
