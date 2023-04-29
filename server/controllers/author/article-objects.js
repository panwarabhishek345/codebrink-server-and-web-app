var { ArticleObject } = require("./../../models/ArticleObject");
var { AuthorObject } = require("./../../models/AuthorObject");

module.exports.postArticleObjects = (req, res) => {
  var authorId;
  if (req.body.type == "web") {
    authorId = "";
  } else {
    authorId = "";
  }

  AuthorObject.findOne({ email: req.email }).then(
    author => {
      var newArticleObject = new ArticleObject({
        title: req.body.title,
        body: req.body.body,
        topic: req.body.topic,
        subtopic: req.body.subtopic,
        type: req.body.type,
        tags: req.body.tags,
        articleImage: req.body.articleImage,
        rating: 0,
        likes: 0,
        mediaObjects: req.body.mediaObjects,
        author: authorId,
        uploader: author._id,
        views: 0,
        status: "draft"
      });

      newArticleObject.save().then(
        article => {
          author.myArticles.unshift(article._id);
          author
            .save()
            .then(doc => {
              res.send(article);
            })
            .catch(err => {
              console.log(
                "E003, Error Saving the Author after inserting the article into myArticles: " +
                  err
              );
              res.status(400).send(err);
            });
        },
        err => {
          console.log("Unable to save the ArticleObject", err);
          res.status(400).send("Unable to save the ArticleObject" + err);
        }
      );
    },
    e => {
      return res.render("author/error", {
        message: "Please try to login again. " + e
      });
    }
  );
};

module.exports.deleteArticle = (req, res) => {
  var articleId = req.query.id;

  if (!articleId) {
    return res.status(400).send("Please specify the article id");
  } else {
    ArticleObject.findById(articleId)
      .populate("uploader", "email")
      .then(article => {
        if (!article) return res.status(404).send();
        if (article.status == "published" || article.status == "under_review")
          return res
            .status(404)
            .send(
              "You are not authorised to delete this published or articles under review."
            );
        if (article.uploader.email == req.email) {
          ArticleObject.findOneAndDelete({ _id: articleId })
            .then(removed => {
              ArticleObject.removeRefs(articleId);
              res.send("Deleted the article successfully");
            })
            .catch(err => {
              console.log(err);
              return res
                .status(401)
                .send("Error occurred while removing the article. " + err);
            });
        } else {
          return res.status(401).send("This article doesn't belong to you.");
        }
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
};

module.exports.editArticle = (req, res) => {
  var articleId = req.body._id;

  AuthorObject.findOne({ email: req.email }).then(
    author => {
      var index = author.myArticles.indexOf(articleId.toString());
      if (index != -1) {
        ArticleObject.findById(articleId)
          .populate("author")
          .then(ArticleObject => {
            if (!ArticleObject) return res.status(404).send();
            if (
              ArticleObject.status == "published" ||
              ArticleObject.status == "under_review"
            )
              return res
                .status(404)
                .send(
                  "You are not authorised to edit published or articles under review."
                );

            ArticleObject.title = req.body.title;
            ArticleObject.body = req.body.body;
            ArticleObject.topic = req.body.topic;
            ArticleObject.subtopic = req.body.subtopic;
            ArticleObject.type = req.body.type;
            ArticleObject.tags = req.body.tags;
            ArticleObject.status = "draft";
            ArticleObject.articleImage = req.body.articleImage;
            ArticleObject.mediaObjects = req.body.mediaObjects;

            var authorId;
            if (req.body.type == "web") {
              authorId = "";
            } else {
              authorId = "";
            }
            ArticleObject.author = authorId;

            ArticleObject.save()
              .then(ArticleObject => {
                res.send(ArticleObject);
              })
              .catch(err => {
                console.log("Error Saving the edited article " + err);
                res.status(400).send(err);
              });
          })
          .catch(e => {
            res.status(400).send(e);
          });
      } else {
        return res.status(401).send("This article doesn't belong to you.");
      }
    },
    e => {
      return res.render("author/error", {
        message: "Please try to login again. " + e
      });
    }
  );
};

module.exports.postArticleForReview = (req, res) => {
  var articleId = req.body._id;

  AuthorObject.findOne({ email: req.email }).then(
    author => {
      var index = author.myArticles.indexOf(articleId.toString());
      if (index != -1) {
        ArticleObject.findById(articleId)
          .populate("author")
          .then(ArticleObject => {
            if (!ArticleObject) return res.status(404).send();
            if (
              ArticleObject.status == "published" ||
              ArticleObject.status == "under_review"
            )
              return res
                .status(404)
                .send("Article already published or under review.");

            ArticleObject.title = req.body.title;
            ArticleObject.body = req.body.body;
            ArticleObject.topic = req.body.topic;
            ArticleObject.subtopic = req.body.subtopic;
            ArticleObject.type = req.body.type;
            ArticleObject.tags = req.body.tags;
            ArticleObject.status = "under_review";
            ArticleObject.articleImage = req.body.articleImage;
            ArticleObject.mediaObjects = req.body.mediaObjects;

            var authorId;
            if (req.body.type == "web") {
              authorId = "";
            } else {
              authorId = "";
            }
            ArticleObject.author = authorId;

            ArticleObject.save()
              .then(ArticleObject => {
                res.send(ArticleObject);
              })
              .catch(err => {
                console.log(
                  "Error While Posting the article for review " + err
                );
                res.status(400).send(err);
              });
          })
          .catch(e => {
            res.status(400).send(e);
          });
      } else {
        return res.status(401).send("This article doesn't belong to you.");
      }
    },
    e => {
      return res.render("author/error", {
        message: "Please try to login again. " + e
      });
    }
  );
};

module.exports.cancelReviewRequest = (req, res) => {
  var articleId = req.query.id;

  if (!articleId) {
    return res.status(400).send("Please specify the article id");
  }

  AuthorObject.findOne({ email: req.email }).then(
    author => {
      var index = author.myArticles.indexOf(articleId.toString());
      if (index != -1) {
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
            res.status(400).send(e);
          });
      } else {
        return res.status(401).send("This article doesn't belong to you.");
      }
    },
    e => {
      return res.render("author/error", {
        message: "Please try to login again. " + e
      });
    }
  );
};

module.exports.getDashboard = (req, res) => {
  var page = req.header("page");

  AuthorObject.findOne({ email: req.email })
    .populate("myArticles")
    .then(
      author => {
        if (page == "article-editor")
          return res.render("author/dashboard", {
            page: "article-editor",
            myArticles: null
          });
        else
          return res.render("author/dashboard", {
            page: "my-articles",
            myArticles: author.myArticles
          });
      },
      e => {
        return res
          .status(401)
          .render("error", { message: "Please try to login again. " + e });
      }
    );
};

module.exports.getMyArticles = (req, res) => {
  AuthorObject.findOne({ email: req.email })
    .populate("myArticles")
    .then(
      author => {
        return res.render("author/menu-pages/my-articles", {
          page: "my-articles",
          myArticles: author.myArticles
        });
      },
      e => {
        return res.render("author/error", {
          message: "Please try to login again. " + e
        });
      }
    );
};

module.exports.openEditor = (req, res) => {
  return res.render("author/menu-pages/article-editor", {
    page: "article-editor",
    myArticles: null
  });
};
