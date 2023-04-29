var { CategoryObject } = require("./../models/CategoryObject");
const server_keys = require("./../config/server-keys");

var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

module.exports.getCategoryObjects = (req, res) => {
  var key = req.header("api_access_key_user");
  if (key != api_access_key_user) {
    res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  } else {
    CategoryObject.find().then(
      CategoryObjects => {
        res.send(CategoryObjects);
      },
      e => {
        res.status(400).send(e);
      }
    );
  }
};

module.exports.postCategoryObjects = (req, res) => {
  var key = req.header("api_access_key_admin");
  if (key != api_access_key_admin) {
    res
      .status(400)
      .send("Wrong admin id. You are not authorised to use the api.");
  } else {
    var newCategory = new CategoryObject({
      title: req.body.title,
      description: req.body.description,
      imageURL: req.body.imageURL,
      topics: req.body.topics
    });

    newCategory.save().then(
      doc => {
        res.send(doc);
        console.log("Saved the CategoryObject ", doc);
      },
      err => {
        res.status(400).send(err);
        console.log("Unable to save the CategoryObject", err);
      }
    );
  }
};
