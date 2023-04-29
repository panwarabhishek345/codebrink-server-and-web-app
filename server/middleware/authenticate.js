var { UserObject } = require("./../models/UserObject");
var { GoogleUserObject } = require("./../models/GoogleUserObject");
var { AuthorObject } = require("./../models/AuthorObject");

const server_keys = require("./../config/server-keys");
const _ = require("lodash");

var admin = require("firebase-admin");
var serviceAccount = require("./../config/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

var authenticate = (req, res, next) => {
  var key = req.header("api_access_key_user");
  var token = req.header("x-auth");
  if (key != api_access_key_user || !token) {
    return res.status(400).send("You are not authorised to use the api.");
  }

  UserObject.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject("No user found!");
      }

      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      res.status(401).send(e);
    });
};

var authenticateGoogle = (req, res, next) => {
  var key = req.header("api_access_key_user");
  var idToken = req.header("IDToken");

  if (!idToken) {
    console.log("E002, You are not authorised to use the api.");
    return res.status(400).send("E002, You are not authorised to use the api.");
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function(decodedToken) {
      req.email = decodedToken.email;
      console.log("Token is correct " + decodedToken.email);
      next();
    })
    .catch(function(error) {
      // Handle error
      console.log("E004, Token is incorrect, " + idToken + error);
      res.status(400).send("E004, Token is incorrect, " + idToken + error);
    });
};

var authenticateGoogleAuthor = (req, res, next) => {
  var idToken = req.header("IDToken");

  if (!idToken) {
    console.log("E002, You are not authorised to use the api.");
    return res.redirect("/");
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function(decodedToken) {
      req.email = decodedToken.email;
      AuthorObject.findOne({ email: req.email }).then(
        author => {
          if (author && author.verified == true) {
            console.log("Token is correct " + decodedToken.email);
            next();
          } else
            return res
              .status(401)
              .render("error", {
                message: "You are not a verified author yet."
              });
        },
        e => {
          return res
            .status(401)
            .render("error", { message: "Please try to login again. " + e });
        }
      );
    })
    .catch(function(error) {
      console.log("E004, Token is incorrect, " + idToken + error);
      return res.redirect("/");
    });
};

var authenticateGoogleAdmin = (req, res, next) => {
  var idToken = req.header("IDToken");

  if (!idToken) {
    console.log("E002, You are not authorised to use the api.");
    return res.redirect("/");
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function(decodedToken) {
      AuthorObject.findOne({ email: decodedToken.email })
        .then(user => {
          if (user && user.role == "admin") next();
          else
            return res.render("error", {
              message: "You are not a verified admin yet."
            });
        })
        .catch(err => {
          return res.render("error", {
            message: "You are not a verified admin yet."
          });
        });
    })
    .catch(function(error) {
      console.log("E004, Token is incorrect, " + idToken + error);
      return res.redirect("/");
    });
};

module.exports = {
  authenticate,
  authenticateGoogle,
  authenticateGoogleAuthor,
  authenticateGoogleAdmin
};
