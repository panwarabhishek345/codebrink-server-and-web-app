const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");

var GoogleUserObjectSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true
    // validate: {
    //   validator: validator.isAlphanumeric,
    //   message: "{VALUE} is not a valid username!"
    // }
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
  name: {
    type: String,
    minlength: 1,
    trim: true
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
  confirmed: {
    type: Boolean,
    default: false
  },
  savedArticles: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ArticleObject"
    }
  ],
  likedArticles: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ArticleObject"
    }
  ],
  completedArticles: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ArticleObject"
    }
  ]
});

GoogleUserObjectSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, [
    "username",
    "email",
    "name",
    "profileURL",
    "imageURL",
    "role",
    "savedArticles",
    "likedArticles",
    "completedArticles"
  ]);
};

GoogleUserObjectSchema.statics.findByEmail = function(email) {
  var User = this;
  return User.findOne({
    email: email
  });
};

var GoogleUserObject = mongoose.model(
  "GoogleUserObject",
  GoogleUserObjectSchema
);

module.exports = { GoogleUserObject };
