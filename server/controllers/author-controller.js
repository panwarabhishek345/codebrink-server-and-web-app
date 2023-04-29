var ObjectId = require("mongodb").ObjectID;
var { AuthorObject } = require("./../models/AuthorObject");
const server_keys = require("./../config/server-keys");

var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

module.exports.postAuthorObject = (req, res) => {
  var key = req.header("api_access_key_admin");
  if (key != api_access_key_admin) {
    res
      .status(400)
      .send("Wrong admin id. You are not authorised to use the api.");
  } else {
    var newAuthorObject = new AuthorObject({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      verified: req.body.verified,
      profileURL: req.body.profileURL,
      imageURL: req.body.imageURL
    });

    newAuthorObject.save().then(
      doc => {
        res.send(doc);
        console.log("Saved the Author ", doc);
      },
      err => {
        res.status(400).send(err);
        console.log("Unable to save the Author", err);
      }
    );
  }
};

module.exports.getAuthorObject = (req, res) => {
  var key = req.header("api_access_key_user");
  var id = req.query.id;
  if (key != api_access_key_user) {
    return res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  }

  if (id == null) {
    AuthorObject.find().then(
      AuthorObjects => {
        res.send(AuthorObjects);
      },
      e => {
        res.status(400).send(e);
      }
    );
  } else {
    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }

    AuthorObject.findById(id)
      .then(AuthorObject => {
        if (!AuthorObject) return res.status(404).send();

        res.send(AuthorObject);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
};
