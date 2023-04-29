const server_keys = require("./../config/server-keys");
var dateFormat = require("dateformat");
var ObjectId = require("mongodb").ObjectID;
var { ArticleObject } = require("./../models/ArticleObject");
var api_access_key_user = server_keys.api_access_key_user;

module.exports.testArticle = (req, res) => {
  var key = req.header("api_access_key_user");
  var nightMode = req.query.nightMode;
  if (nightMode == undefined || nightMode == null) {
    nightMode = "false";
  }

  var id = req.query.id;
  // if (key != api_access_key_user) {
  //     return res.redirect('https://play.google.com/store/apps/details?id=com.codebrink.codebrink');
  // }
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  ArticleObject.findById(id)
    .populate("author")
    .then(ArticleObject => {
      if (!ArticleObject) return res.status(404).send();
      var date = dateFormat(ArticleObject.createdAt, "dd mmm yyyy");
      return res.render("article", {
        ArticleObject,
        date,
        nightMode: nightMode
      });
    })
    .catch(e => {
      return res.status(400).send(e);
    });
};

module.exports.testArticleWebView = (req, res) => {
  var key = req.header("api_access_key_user");
  var nightMode = req.query.nightMode;
  if (nightMode == undefined || nightMode == null) {
    nightMode = "false";
  }

  var id = req.query.id;
  // if (key != api_access_key_user) {
  //     return res.redirect('https://play.google.com/store/apps/details?id=com.codebrink.codebrink');
  // }
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  ArticleObject.findById(id)
    .populate("author")
    .then(ArticleObject => {
      if (!ArticleObject) return res.status(404).send();
      var date = dateFormat(ArticleObject.createdAt, "dd mmm yyyy");
      return res.render("articleWebview", {
        ArticleObject,
        date,
        nightMode: nightMode
      });
    })
    .catch(e => {
      return res.status(400).send(e);
    });
};
