var striptags = require("striptags");
var { ArticleObject } = require("./../../models/ArticleObject");
var { GoogleUserObject } = require("./../../models/GoogleUserObject");

module.exports.postUserBookmark = (req, res) => {
  var articleId = req.header("articleId");
  var bookmark = req.header("bookmark");

  GoogleUserObject.findOne({ email: req.email })
    .then(user => {
      if (!user) {
        console.log("E001, User not Found");
        return res.status(400).send("E001, User not Found!");
      }

      var index = user.savedArticles.indexOf(articleId.toString());
      if (index != -1 && bookmark === "false") {
        while (index != -1) {
          user.savedArticles.splice(index, 1);
          console.log("Article Found At", index);
          var index = user.savedArticles.indexOf(articleId.toString());
        }
      } else if (index == -1 && bookmark === "true")
        user.savedArticles.unshift(articleId.toString());

      console.log("Bookmark", bookmark);

      user
        .save()
        .then(doc => {
          res.send(doc);
        })
        .catch(err => {
          console.log(
            "E003, Error Saving the Google User After bookmarking: " + err
          );
          res.status(400).send(err);
        });
    })
    .catch(e => {
      console.log("Error User-Data-Route" + e);
      res.status(401).send(e);
    });
};

module.exports.postUserLike = (req, res) => {
  var articleId = req.header("articleId");
  var like = req.header("like");

  GoogleUserObject.findOne({ email: req.email })
    .then(user => {
      if (!user) {
        console.log("E001, User not Found");
        return res.status(400).send("E001, User not Found!");
      }

      ArticleObject.findById(articleId)
        .then(ArticleObject => {
          if (!ArticleObject) return res.status(404).send();

          var index = user.likedArticles.indexOf(articleId.toString());
          if (index != -1 && like === "false") {
            while (index != -1) {
              user.likedArticles.splice(index, 1);
              console.log("Article Found At", index);
              var index = user.likedArticles.indexOf(articleId.toString());

              ArticleObject.likes = ArticleObject.likes - 1;
              ArticleObject.save();
            }
          } else if (index == -1 && like === "true") {
            user.likedArticles.unshift(articleId.toString());
            ArticleObject.likes = ArticleObject.likes + 1;
            ArticleObject.save();
          }

          console.log("Like", like);

          user
            .save()
            .then(doc => {
              res.send(doc);
            })
            .catch(err => {
              console.log(
                "E003, Error Saving the Google User After liking: " + err
              );
              res.status(400).send(err);
            });
        })
        .catch(e => {
          res.status(400).send(e);
        });
    })
    .catch(e => {
      console.log("Error User-Data-Route" + e);
      res.status(401).send(e);
    });
};

module.exports.postUserComplete = (req, res) => {
  var articleId = req.header("articleId");
  var complete = req.header("complete");

  GoogleUserObject.findOne({ email: req.email })
    .then(user => {
      if (!user) {
        console.log("E001, User not Found");
        return res.status(400).send("E001, User not Found!");
      }

      var index = user.completedArticles.indexOf(articleId.toString());
      if (index != -1 && complete === "false") {
        while (index != -1) {
          user.completedArticles.splice(index, 1);
          console.log("Article Found At", index);
          var index = user.completedArticles.indexOf(articleId.toString());
        }
      } else if (index == -1 && complete === "true")
        user.completedArticles.unshift(articleId.toString());

      console.log("Complete", complete);

      user
        .save()
        .then(doc => {
          res.send(doc);
        })
        .catch(err => {
          console.log(
            "E003, Error Saving the Google User After Marking Complete: " + err
          );
          res.status(400).send(err);
        });
    })
    .catch(e => {
      console.log("Error User-Data-Route" + e);
      res.status(401).send(e);
    });
};

// module.exports.userBookmarkedArticles = (req, res) => {

//     var googleUid = req.header("googleUid");

//     GoogleUserObject.findOne({ googleUid: googleUid })
//         .populate({
//             path: 'savedArticles',
//             populate: { path: 'author' }
//         })
//         .then(user => {
//             if (!user) {
//                 console.log("E001, User not Found");
//                 return res.status(400).send("E001, User not Found!");
//             }

//             console.log("SavedArticles User Found");

//             console.log("SavedArticles Author User Found" + user.savedArticles[0]);
//             user.savedArticles.forEach(article => {
//                 article.bookmarked = true;
//                 if (user.likedArticles.indexOf(article._id) != -1)
//                     article.liked = true;

//             });
//             res.send(user.savedArticles);

//         })
//         .catch(e => {
//             console.log("Error User-Data-Route" + e);
//             res.status(401).send(e);
//         });
// };

module.exports.userBookmarkedArticles = (req, res) => {
  var limit = 15;
  var reqNext = req.header("reqNext");
  // var nightMode = req.header("nightMode");

  GoogleUserObject.findOne({ email: req.email })
    .populate({
      path: "savedArticles",
      populate: { path: "author" }
    })
    .then(user => {
      if (!user) {
        console.log("E001, User not Found");
        return res.status(400).send("E001, User not Found!");
      }

      user.savedArticles = user.savedArticles.slice(
        (reqNext - 1) * limit,
        reqNext * limit
      );

      console.log("SavedArticles User Found");

      user.savedArticles.forEach(article => {
        article.bookmarked = true;
        if (user.likedArticles.indexOf(article._id) != -1) article.liked = true;
        if (user.completedArticles.indexOf(article._id) != -1)
          article.completed = true;
        if (article.body.length >= 250)
          article.body = article.body.substring(0, 250);
        article.body = striptags(article.body);
        article.mediaObjects = null;
      });

      res.send(user.savedArticles);

      // prepareArticlesHtml(user.savedArticles, nightMode)
      //     .then(ArticleObjects => {
      //         res.send(ArticleObjects);
      //     })
      //     .catch(error => {
      //         if (error)
      //             res.status(400).send(error);
      //     });
    })
    .catch(e => {
      console.log("Error User-Data-Route" + e);
      res.status(401).send(e);
    });
};

// async function prepareArticlesHtml(ArticleObjects, nightMode) {

//     ArticleObjects = await Promise.all(ArticleObjects.map(async articleObject => {
//         var html = await getHtml(articleObject, nightMode);

//         if (articleObject.body.length >= 250)
//             articleObject.body = articleObject.body.substring(0, 250) + "!h%s!" + html;
//         else
//             articleObject.body = articleObject.body + "!h%s!" + html;

//         return articleObject;
//     }));
//     return ArticleObjects;
// }

// async function getHtml(ArticleObject, nightMode) {
//     var date = dateFormat(ArticleObject.createdAt, "dd mmm yyyy");
//     try {
//         let html = await ejs.renderFile("./server/views/article.ejs", { ArticleObject, date, nightMode: nightMode });
//         return html;
//     } catch (error) {
//         throw error;
//     }

// }
