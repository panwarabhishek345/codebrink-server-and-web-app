const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { tokenSalt } = require("./../config/auth-tokens.js");

var UserObjectSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isAlphanumeric,
      message: "{VALUE} is not a valid username!"
    }
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
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
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
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserObjectSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, [
    "_id",
    "username",
    "email",
    "name",
    "profileURL",
    "imageURL"
  ]);
};

UserObjectSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, tokenSalt)
    .toString();

  user.tokens = [];
  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

UserObjectSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, tokenSalt);
  } catch (e) {
    return Promise.reject(e);
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserObjectSchema.statics.findByCredentials = function(
  username,
  email,
  password
) {
  var User = this;

  if (email) {
    return User.findOne({ email }).then(user => {
      if (!user) return Promise.reject("Email not found!");

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) resolve(user);
          else reject("Wrong Password!");
        });
      });
    });
  } else {
    return User.findOne({ username }).then(user => {
      if (!user) return Promise.reject("Username not found!");

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) resolve(user);
          else reject("Wrong Password!");
        });
      });
    });
  }
};

UserObjectSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var UserObject = mongoose.model("UserObject", UserObjectSchema);
module.exports = { UserObject };
