var express = require("express");
var ObjectId = require("mongodb").ObjectID;
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var router = express.Router();

var { UserObject } = require("./../models/UserObject");
var { GoogleUserObject } = require("./../models/GoogleUserObject");

const { authenticate } = require("./../middleware/authenticate.js");
const { authenticateGoogle } = require("./../middleware/authenticate.js");
const { tokenSalt } = require("./../config/auth-tokens.js");
const server_keys = require("./../config/server-keys");
const { transporter } = require("../config/node-mailer");
const { emailCodebrink } = require("../config/node-mailer");
const { baseUrl } = require("./../config/urls");

var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

//User being registered for the first time.
router.post("/Users/signup", (req, res) => {
  var key = req.header("api_access_key_user");
  if (key != api_access_key_user) {
    return res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  }

  var body = _.pick(req.body, [
    "username",
    "email",
    "password",
    "name",
    "profileURL",
    "imageURL"
  ]);
  var newUserObject = new UserObject(body);

  newUserObject.save().then(
    doc => {
      sendConfirmationMail(newUserObject);
      res.send(doc);
      console.log("Saved User temporarily and confirmaion email sent", doc);
    },
    err => {
      res.status(400).send(err);
      console.log("Some error occurred!", err);
    }
  );
});

function sendConfirmationMail(newUserObject) {
  //Hashing for login tokens
  // var access = 'auth';
  // var token = jwt.sign({_id: newUserObject._id.toHexString(), access}, tokenSalt).toString();
  // newUserObject.tokens.push({access, token});

  //Hashing for email confirmation token
  let confirmToken = jwt
    .sign({ _id: newUserObject._id.toHexString() }, tokenSalt, {
      expiresIn: "1d"
    })
    .toString();

  const url = baseUrl + `/confirmation/${confirmToken}`;

  transporter.sendMail(
    {
      from: `Codebrink <${emailCodebrink}>`,
      to: newUserObject.email,
      subject: "Confirm Email",
      html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    }
  );
}

//User being confirmed through the mail
router.get("/confirmation/:confirmToken", (req, res) => {
  let confirmToken = null;
  jwt.verify(req.params.confirmToken, tokenSalt, function(err, decoded) {
    if (err) return;
    confirmToken = decoded;
  });

  if (confirmToken != null) {
    let updateObj = { confirmed: true };

    UserObject.findByIdAndUpdate(confirmToken, updateObj, function(err, user) {
      if (!user || err) {
        return res.status(400).send("Something went wrong!");
      }
      res.send("You have been successfully registered!");
    });
  } else {
    return res.status(400).send("Link has been expired!");
  }
});

// User Login
router.get("/Users/login", (req, res) => {
  var key = req.header("api_access_key_user");
  if (key != api_access_key_user) {
    return res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  }

  let username = req.header("username");
  let email = req.header("email");
  let password = req.header("password");

  UserObject.findByCredentials(username, email, password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// Google User Login
router.post("/Users/googleUser", authenticateGoogle, (req, res) => {
  GoogleUserObject.findOne({ email: req.email })
    .then(user => {
      if (!user) {
        user = new GoogleUserObject(req.body);
      }
      user.save().then(
        doc => {
          res.send(doc);
        },
        err => {
          console.log("Error Saving the Google User: " + err);
          res.status(400).send(err);
        }
      );
    })
    .catch(e => {
      console.log("Error findById(Correct Token)" + e);
      res.status(401).send(e);
    });
});

//User fetching his profile
router.get("/Users/me", authenticate, (req, res) => {
  res.send(req.user);
});

//Getting all the users
router.get("/Users", (req, res) => {
  var key = req.header("api_access_key_user");
  var id = req.query.id;
  if (key != api_access_key_user) {
    return res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  }

  if (id == null) {
    UserObject.find().then(
      UserObjects => {
        res.send(UserObjects);
      },
      e => {
        res.status(400).send(e);
      }
    );
  } else {
    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }

    UserObject.findById(id)
      .then(UserObject => {
        if (!UserObject) return res.status(404).send();

        res.send(UserObject);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
});

module.exports = router;
