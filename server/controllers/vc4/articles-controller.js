const server_keys = require("./../../config/server-keys");
var dateFormat = require("dateformat");
var ObjectId = require("mongodb").ObjectID;
var { ArticleObject } = require("./../../models/ArticleObject");
var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

module.exports.editArticle = (req, res) => {
  var key = req.header("api_access_key_admin");

  if (key != api_access_key_admin) {
    res
      .status(400)
      .send("Wrong admin id. You are not authorised to use the api.");
  } else {
    ArticleObject.findById(req.body._id)
      .populate("author")
      .then(ArticleObject => {
        if (!ArticleObject) return res.status(404).send();

        ArticleObject.title = req.body.title;
        ArticleObject.body = req.body.body;
        ArticleObject.topic = req.body.topic;
        ArticleObject.subtopic = req.body.subtopic;
        ArticleObject.tags = req.body.tags;
        ArticleObject.videoURL = req.body.videoURL;
        ArticleObject.articleImage = req.body.articleImage;
        // ArticleObject.rating = req.body.rating;
        // ArticleObject.likes = req.body.likes;
        ArticleObject.mediaObjects = req.body.mediaObjects;
        ArticleObject.author = req.body.author;
        // ArticleObject.views = req.body.views;
        (ArticleObject.type = req.body.type),
          (ArticleObject.createdAt = req.body.createdAt);
        ArticleObject.status = req.body.status;

        ArticleObject.save();
        res.send(ArticleObject);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
};

module.exports.deleteArticle = (req, res) => {
  var key = req.header("api_access_key_admin");
  var articleId = req.query.id;

  if (!articleId) {
    return res.status(400).send("Please specify the article id");
  }

  if (key != api_access_key_admin) {
    return res
      .status(400)
      .send("Wrong admin id. You are not authorised to use the api.");
  } else {
    ArticleObject.findOneAndDelete({ _id: articleId })
      .then(removed => {
        ArticleObject.removeRefs(articleId);
        return res.send("Deleted the article successfully");
      })
      .catch(err => {
        console.log(err);
        return res
          .status(401)
          .send("Error occurred while removing the article. " + err);
      });
  }
};

module.exports.articleObject = (req, res) => {
  var key = req.header("api_access_key_user");
  var nightMode = req.header("nightMode");
  if (nightMode == undefined || nightMode == null) {
    nightMode = "false";
  }

  var id = req.query.id;
  if (key != api_access_key_user) {
    return res.redirect(
      ""
    );
  }
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  ArticleObject.findById(id)
    .populate("author")
    .then(ArticleObject => {
      if (!ArticleObject) return res.status(404).send();
      ArticleObject.views = ArticleObject.views + 1;
      ArticleObject.save();
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

module.exports.articleObjectWebView = (req, res) => {
  var key = req.header("api_access_key_user");
  var nightMode = req.header("nightMode");
  if (nightMode == undefined || nightMode == null) {
    nightMode = "false";
  }

  var id = req.query.id;
  if (key != api_access_key_user) {
    return res.redirect(
      "
    );
  }
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  ArticleObject.findById(id)
    .populate("author")
    .then(ArticleObject => {
      if (!ArticleObject) return res.status(404).send();
      ArticleObject.views = ArticleObject.views + 1;
      ArticleObject.save();
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

module.exports.postArticleObjects = (req, res) => {
  var key = req.header("api_access_key_admin");

  if (key != api_access_key_admin) {
    res
      .status(400)
      .send("Wrong admin id. You are not authorised to use the api.");
  } else {
    var newArticleObject = new ArticleObject({
      title: req.body.title,
      body: req.body.body,
      topic: req.body.topic,
      subtopic: req.body.subtopic,
      tags: req.body.tags,
      videoURL: req.body.videoURL,
      articleImage: req.body.articleImage,
      rating: req.body.rating,
      likes: req.body.likes,
      mediaObjects: req.body.mediaObjects,
      author: req.body.author,
      type: req.body.type,
      views: req.body.views,
      createdAt: req.body.createdAt,
      status: req.body.status
    });

    newArticleObject.save().then(
      doc => {
        res.send(doc);
        console.log("Saved the ArticleObject ", doc);
      },
      err => {
        res.status(400).send("Unable to save the ArticleObject" + err);
        console.log("Unable to save the ArticleObject", err);
      }
    );
  }
};

module.exports.getArticleObjects = (req, res) => {
  var key = req.header("api_access_key_user");
  var id = req.query.id;
  if (key != api_access_key_user) {
    return res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  }

  if (id == null) {
    ArticleObject.find()
      .populate("author")
      .then(
        ArticleObjects => {
          res.send(ArticleObjects);
        },
        e => {
          res.status(400).send(e);
        }
      );
  } else {
    if (!ObjectId.isValid(id)) {
      return res.status(404).send("Object Id is not valid");
    }

    ArticleObject.findById(id)
      .populate("author")
      .then(ArticleObject => {
        if (!ArticleObject) return res.status(404).send();

        ArticleObject.views = ArticleObject.views + 1;
        ArticleObject.save();
        res.send(ArticleObject);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
};

module.exports.getDraftArticles = (req, res) => {
  var key = req.header("api_access_key_admin");
  if (key != api_access_key_admin) {
    return res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  }

  ArticleObject.find({ status: { $ne: "published" } })
    .populate("author")
    .then(
      ArticleObjects => {
        res.send(ArticleObjects);
      },
      e => {
        res.status(400).send(e);
      }
    );
};
