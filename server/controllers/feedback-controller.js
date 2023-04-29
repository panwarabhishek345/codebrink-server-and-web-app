var { FeedbackObject } = require("./../models/Feedback");
const server_keys = require("./../config/server-keys");

var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

var limit = 15;

module.exports.getFeedbackObjects = (req, res) => {
  var key = req.header("api_access_key_admin");
  if (key != api_access_key_admin) {
    res
      .status(400)
      .send("Wrong admin id. You are not authorised to use the api.");
  } else {
    var reqNext = req.header("reqNext");
    if (reqNext != null) {
      FeedbackObject.find({ _id: { $lt: reqNext } })
        .sort({ _id: -1 })
        .limit(limit)
        .then(
          FeedbackObjects => {
            res.send(FeedbackObjects);
          },
          e => {
            res.status(400).send(e);
          }
        );
    } else {
      FeedbackObject.find()
        .sort({ _id: -1 })
        .limit(limit)
        .then(
          FeedbackObjects => {
            res.send(FeedbackObjects);
          },
          e => {
            res.status(400).send(e);
          }
        );
    }
  }
};

module.exports.postFeedbackObjects = (req, res) => {
  var key = req.header("api_access_key_user");

  if (key != api_access_key_user) {
    res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  } else {
    var newFeedbackObject = new FeedbackObject({
      title: req.body.title,
      body: req.body.body
    });

    newFeedbackObject.save().then(
      doc => {
        res.send(doc);
        console.log("Saved the Feedback ", doc);
      },
      err => {
        res.status(400).send(err);
        console.log("Unable to save the Feedback ", err);
      }
    );
  }
};
