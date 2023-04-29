var { ArticleObject } = require("./../../models/ArticleObject");
var { AuthorObject } = require("./../../models/AuthorObject");

module.exports.deleteArticle = (req, res) => {
  let articleId = req.query.id;

  if (!articleId) {
    return res.status(400).send("Please specify the courseId.");
  }

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
};

module.exports.deleteArticlesByTopic = (req, res) => {
  let topic = req.header("topic");

  if (!topic) {
    return res.status(400).send("Please specify the topic.");
  }

  ArticleObject.deleteMany({ topic: topic })
    .then(removed => {
      for (var i = 0; i < removed.length; i++)
        ArticleObject.removeRefs(removed[i]._id);
      return res.send("Deleted the articles successfully " + removed.length);
    })
    .catch(err => {
      console.log(err);
      return res
        .status(401)
        .send("Error occurred while removing the articles. " + err);
    });
};

module.exports.cancelReviewRequest = (req, res) => {
  var articleId = req.query.id;

  if (!articleId) {
    return res.status(400).send("Please specify the article id");
  }

  ArticleObject.findById(articleId)
    .populate("author")
    .then(ArticleObject => {
      if (!ArticleObject) return res.status(404).send();
      if (ArticleObject.status != "under_review")
        return res.status(404).send("Article not under review.");

      ArticleObject.status = "draft";

      ArticleObject.save()
        .then(ArticleObject => {
          res.send(ArticleObject);
        })
        .catch(err => {
          console.log(
            "Error occurred while cancelling the review request. " + err
          );
          res.status(400).send(err);
        });
    })
    .catch(e => {
      console.log("Error finding the article " + e);
      res.status(400).send(e);
    });
};

module.exports.editArticle = (req, res) => {
  ArticleObject.findById(req.body._id)
    .populate("author")
    .then(ArticleObject => {
      if (!ArticleObject) return res.status(404).send();

      ArticleObject.title = req.body.title;
      ArticleObject.body = req.body.body;
      ArticleObject.type = req.body.type;
      ArticleObject.topic = req.body.topic;
      ArticleObject.subtopic = req.body.subtopic;
      ArticleObject.tags = req.body.tags;
      ArticleObject.articleImage = req.body.articleImage;
      ArticleObject.mediaObjects = req.body.mediaObjects;
      ArticleObject.createdAt = Date.now();
      var authorId;
      if (req.body.type == "web") {
        authorId = "5d7e811b64b5cc0b78fe390c";
      } else {
        authorId = "5c8bd15a682bf72558bfc749";
      }
      ArticleObject.author = authorId;
      ArticleObject.save();
      res.send(ArticleObject);
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

module.exports.getDashboard = (req, res) => {
  var page = req.header("page");

  ArticleObject.find()
    .populate("uploader")
    .sort({ createdAt: -1 })
    .limit(20)
    .then(articles => {
      if (page == "article-editor")
        return res.render("admin/dashboard", {
          page: "article-editor",
          articles: null
        });
      else
        return res.render("admin/dashboard", {
          page: "all-articles",
          articles: articles
        });
    })
    .catch(e => {
      return res.render("error", {
        message: "Please try to login again. " + e
      });
    });
};

module.exports.getAllArticles = (req, res) => {
  let reqNext = req.header("reqNext");
  let reqPrev = req.header("reqPrev");

  if (!reqNext && !reqPrev) {
    ArticleObject.find()
      .populate("uploader")
      .sort({ createdAt: -1 })
      .limit(20)
      .then(articles => {
        return res.render("admin/menu-pages/all-articles", {
          page: "all-articles",
          articles: articles
        });
      })
      .catch(e => {
        return res.render("error", {
          message: "Please try to login again. " + e
        });
      });
  } else if (reqNext) {
    ArticleObject.find({ createdAt: { $lt: reqNext } })
      .populate("uploader")
      .sort({ createdAt: -1 })
      .limit(20)
      .then(articles => {
        console.log(articles[0].title);
        return res.render("admin/menu-pages/all-articles", {
          page: "all-articles",
          articles: articles
        });
      })
      .catch(e => {
        return res.render("error", {
          message: "Please try to login again. " + e
        });
      });
  } else if (reqPrev) {
    ArticleObject.find({ createdAt: { $gt: reqPrev } })
      .populate("uploader")
      .sort({ createdAt: -1 })
      .limit(20)
      .then(articles => {
        return res.render("admin/menu-pages/all-articles", {
          page: "all-articles",
          articles: articles
        });
      })
      .catch(e => {
        return res.render("error", {
          message: "Please try to login again. " + e
        });
      });
  } else
    return res.render("error", { message: "Please try to login again. " + e });
};

module.exports.searchArticles = (req, res) => {
  let query = req.header("query");
  if (!query)
    return res.status(400).render("error", { message: "Query is empty " + e });

  ArticleObject.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .populate("uploader")
    .sort({ score: { $meta: "textScore" } })
    .exec(function(err, articles) {
      if (err)
        res
          .status(401)
          .render("error", { message: "Some error occurred. " + e });
      return res.render("admin/menu-pages/all-articles", {
        page: "all-articles",
        articles: articles
      });
    });
};

module.exports.rejectArticle = (req, res) => {
  var articleId = req.query.id;

  if (!articleId) {
    return res.status(400).send("Please specify the article id");
  }

  ArticleObject.findById(articleId)
    .populate("author")
    .then(ArticleObject => {
      if (!ArticleObject) return res.status(404).send();

      ArticleObject.status = "rejected";

      ArticleObject.save()
        .then(ArticleObject => {
          res.send(ArticleObject);
        })
        .catch(err => {
          console.log("Error occurred while rejecting the article. " + err);
          res.status(400).send(err);
        });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

module.exports.publishArticle = (req, res) => {
  var articleId = req.query.id;

  if (!articleId) {
    return res.status(400).send("Please specify the article id");
  }

  ArticleObject.findById(articleId)
    .populate("author")
    .then(ArticleObject => {
      console.log(ArticleObject);

      if (!ArticleObject) return res.status(404).send();
      if (ArticleObject.status == "published")
        return res.status(404).send("Article is already published.");

      ArticleObject.status = "published";

      var authorId;
      if (ArticleObject.type == "web") {
        authorId = "5d7e811b64b5cc0b78fe390c";
      } else {
        authorId = "5c8bd15a682bf72558bfc749";
      }
      ArticleObject.author = authorId;

      ArticleObject.createdAt = Date.now();

      ArticleObject.save()
        .then(ArticleObject => {
          res.send(ArticleObject);
        })
        .catch(err => {
          console.log("Error occurred while publishing the article. " + err);
          res.status(400).send(err);
        });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

module.exports.openEditor = (req, res) => {
  return res.render("admin/menu-pages/article-editor", {
    page: "article-editor",
    articles: null
  });
};
