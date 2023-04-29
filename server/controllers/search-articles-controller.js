const server_keys = require("./../config/server-keys");
var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

var { StringsObject } = require("./../models/StringsObject");

module.exports.getTrendingSearches = (req, res) => {
  var key = req.header("api_access_key_user");
  if (key != api_access_key_user) {
    return res
      .status(400)
      .send("Wrong user id. You are not authorised to use the api.");
  }

  StringsObject.findOne({ name: "trending_searches" })
    .then(stringsobject => {
      if (!stringsobject) return res.status(404).send();
      res.send(stringsobject.strings);
    })
    .catch(e => {
      return res.status(400).send(e);
    });
};

module.exports.postTrendingSearches = (req, res) => {
  var key = req.header("api_access_key_admin");
  if (key != api_access_key_admin) {
    return res
      .status(400)
      .send("Wrong admin id. You are not authorised to use the api.");
  }

  var newStringsObject = new StringsObject({
    name: req.body.name,
    strings: req.body.strings
  });

  newStringsObject.save().then(
    doc => {
      res.send(doc);
      console.log("Saved the StringsObject ", doc);
    },
    err => {
      res.status(400).send(err);
      console.log("Unable to save the StringsObject", err);
    }
  );
};
