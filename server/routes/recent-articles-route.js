var express = require("express");
var router = express.Router();

var { ArticleObject } = require("./../models/ArticleObject");
var {
  setBookmarksAndLikes,
  prepareArticles
} = require("./../controllers/utils/set-user-properties");
const server_keys = require("./../config/server-keys");

var { GoogleUserObject } = require("./../models/GoogleUserObject");
const { authenticateGoogle } = require("./../middleware/authenticate.js");

router.get("/RecentArticles", (req, res) => {
  var key = req.header("api_access_key_user");
  var requestPage = req.header("page");
  var requestLimit = req.header("limit");
  var reqNext = req.header("reqNext");
  var reqPrev = req.header("reqPrev");
  var topic = req.header("topic");
  var subtopic = req.header("subtopic");
  // var nightMode = req.header("nightMode");
  var limit = 15;

  // if (key != api_access_key_user) {
  //   return res
  //     .status(400)
  //     .send("Wrong client id. You are not authorised to use the api.");
  // }

  if (topic != null && subtopic != null) {
    if (reqNext != null) {
      ArticleObject.find({
        createdAt: { $gt: reqNext },
        topic: topic,
        subtopic: subtopic,
        type: { $ne: "web" },
        status: "published"
      })
        .populate("author")
        .sort({ createdAt: 1 })
        .limit(limit)
        .then(
          ArticleObjects => {
            ArticleObjects = prepareArticles(ArticleObjects);
            res.send(ArticleObjects);
            // prepareArticlesHtml(ArticleObjects, nightMode)
            //   .then(ArticleObjects => {
            //     res.send(ArticleObjects);
            //   })
            //   .catch(error => {
            //     if (error)
            //       res.status(400).send(error);
            //   });
          },
          e => {
            res.status(400).send(e);
          }
        );
    } else if (reqPrev != null) {
      ArticleObject.find({
        createdAt: { $lt: reqPrev },
        topic: topic,
        subtopic: subtopic,
        type: { $ne: "web" },
        status: "published"
      })
        .populate("author")
        .sort({ createdAt: 1 })
        .limit(limit)
        .then(
          ArticleObjects => {
            ArticleObjects = prepareArticles(ArticleObjects);
            res.send(ArticleObjects);
            // prepareArticlesHtml(ArticleObjects, nightMode)
            //   .then(ArticleObjects => {
            //     res.send(ArticleObjects);
            //   })
            //   .catch(error => {
            //     if (error)
            //       res.status(400).send(error);
            //   });
          },
          e => {
            res.status(400).send(e);
          }
        );
    } else {
      ArticleObject.find({
        topic: topic,
        subtopic: subtopic,
        type: { $ne: "web" },
        status: "published"
      })
        .populate("author")
        .sort({ createdAt: 1 })
        .limit(limit)
        .then(
          ArticleObjects => {
            ArticleObjects = prepareArticles(ArticleObjects);
            res.send(ArticleObjects);
            // prepareArticlesHtml(ArticleObjects, nightMode)
            //   .then(ArticleObjects => {
            //     res.send(ArticleObjects);
            //   })
            //   .catch(error => {
            //     if (error)
            //       res.status(400).send(error);
            //   });
          },
          e => {
            res.status(400).send(e);
          }
        );
    }
  } else {
    if (reqNext != null) {
      ArticleObject.find({
        createdAt: { $lt: reqNext },
        type: { $ne: "web" },
        status: "published"
      })
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(limit)
        .then(
          ArticleObjects => {
            ArticleObjects = prepareArticles(ArticleObjects);
            res.send(ArticleObjects);
            // prepareArticlesHtml(ArticleObjects, nightMode)
            //   .then(ArticleObjects => {
            //     res.send(ArticleObjects);
            //   })
            //   .catch(error => {
            //     if (error)
            //       res.status(400).send(error);
            //   });
          },
          e => {
            res.status(400).send(e);
          }
        );
    } else if (reqPrev != null) {
      ArticleObject.find({
        createdAt: { $gt: reqPrev },
        type: { $ne: "web" },
        status: "published"
      })
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(limit)
        .then(
          ArticleObjects => {
            ArticleObjects = prepareArticles(ArticleObjects);
            res.send(ArticleObjects);
            // prepareArticlesHtml(ArticleObjects, nightMode)
            //   .then(ArticleObjects => {
            //     res.send(ArticleObjects);
            //   })
            //   .catch(error => {
            //     if (error)
            //       res.status(400).send(error);
            //   });
          },
          e => {
            res.status(400).send(e);
          }
        );
    } else {
      ArticleObject.find({
        type: { $ne: "web" },
        status: "published"
      })
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(limit)
        .then(
          ArticleObjects => {
            ArticleObjects = prepareArticles(ArticleObjects);
            res.send(ArticleObjects);

            // prepareArticlesHtml(ArticleObjects, nightMode)
            //   .then(ArticleObjects => {
            //     res.send(ArticleObjects);
            //   })
            //   .catch(error => {
            //     if (error)
            //       res.status(400).send(error);
            //   });
          },
          e => {
            res.status(400).send(e);
          }
        );
    }
  }
});

router.get("/googleUser/RecentArticles", authenticateGoogle, (req, res) => {
  var requestPage = req.header("page");
  var requestLimit = req.header("limit");
  var reqNext = req.header("reqNext");
  var reqPrev = req.header("reqPrev");
  var topic = req.header("topic");
  var subtopic = req.header("subtopic");
  var limit = 15;
  // var nightMode = req.header("nightMode");

  GoogleUserObject.findByEmail(req.email)
    .then(user => {
      if (!user) {
        console.log("User Not Found!");
        return res.send("User Not Found!");
      }
      console.log("User Found");

      if (topic != null && subtopic != null) {
        if (reqNext != null) {
          ArticleObject.find({
            createdAt: { $gt: reqNext },
            topic: topic,
            subtopic: subtopic,
            type: { $ne: "web" },
            status: "published"
          })
            .populate("author")
            .sort({ createdAt: 1 })
            .limit(limit)
            .then(
              ArticleObjects => {
                //Prepare articles not called because the below method does that work too
                ArticleObjects = setBookmarksAndLikes(ArticleObjects, user);
                res.send(ArticleObjects);
                // prepareArticlesHtml(ArticleObjects, nightMode)
                //   .then(ArticleObjects => {
                //     res.send(ArticleObjects);
                //   })
                //   .catch(error => {
                //     if (error)
                //       res.status(400).send(error);
                //   });
              },
              e => {
                res.status(400).send(e);
              }
            );
        } else if (reqPrev != null) {
          ArticleObject.find({
            createdAt: { $lt: reqPrev },
            topic: topic,
            subtopic: subtopic,
            type: { $ne: "web" },
            status: "published"
          })
            .populate("author")
            .sort({ createdAt: 1 })
            .limit(limit)
            .then(
              ArticleObjects => {
                ArticleObjects = setBookmarksAndLikes(ArticleObjects, user);
                res.send(ArticleObjects);
                // prepareArticlesHtml(ArticleObjects, nightMode)
                //   .then(ArticleObjects => {
                //     res.send(ArticleObjects);
                //   })
                //   .catch(error => {
                //     if (error)
                //       res.status(400).send(error);
                //   });
              },
              e => {
                res.status(400).send(e);
              }
            );
        } else {
          ArticleObject.find({
            topic: topic,
            subtopic: subtopic,
            type: { $ne: "web" },
            status: "published"
          })
            .populate("author")
            .sort({ createdAt: 1 })
            .limit(limit)
            .then(
              ArticleObjects => {
                ArticleObjects = setBookmarksAndLikes(ArticleObjects, user);
                res.send(ArticleObjects);
                // prepareArticlesHtml(ArticleObjects, nightMode)
                //   .then(ArticleObjects => {
                //     res.send(ArticleObjects);
                //   })
                //   .catch(error => {
                //     if (error)
                //       res.status(400).send(error);
                //   });
              },
              e => {
                res.status(400).send(e);
              }
            );
        }
      } else {
        if (reqNext != null) {
          ArticleObject.find({
            createdAt: { $lt: reqNext },
            type: { $ne: "web" },
            status: "published"
          })
            .populate("author")
            .sort({ createdAt: -1 })
            .limit(limit)
            .then(
              ArticleObjects => {
                ArticleObjects = setBookmarksAndLikes(ArticleObjects, user);
                res.send(ArticleObjects);
                // prepareArticlesHtml(ArticleObjects, nightMode)
                //   .then(ArticleObjects => {
                //     res.send(ArticleObjects);
                //   })
                //   .catch(error => {
                //     if (error)
                //       res.status(400).send(error);
                //   });
              },
              e => {
                res.status(400).send(e);
              }
            );
        } else if (reqPrev != null) {
          ArticleObject.find({
            createdAt: { $gt: reqPrev },
            type: { $ne: "web" },
            status: "published"
          })
            .populate("author")
            .sort({ createdAt: -1 })
            .limit(limit)
            .then(
              ArticleObjects => {
                ArticleObjects = setBookmarksAndLikes(ArticleObjects, user);
                res.send(ArticleObjects);
                // prepareArticlesHtml(ArticleObjects, nightMode)
                //   .then(ArticleObjects => {
                //     res.send(ArticleObjects);
                //   })
                //   .catch(error => {
                //     if (error)
                //       res.status(400).send(error);
                //   });
              },
              e => {
                res.status(400).send(e);
              }
            );
        } else {
          ArticleObject.find({
            type: { $ne: "web" },
            status: "published"
          })
            .populate("author")
            .sort({ createdAt: -1 })
            .limit(limit)
            .then(
              ArticleObjects => {
                ArticleObjects = setBookmarksAndLikes(ArticleObjects, user);
                res.send(ArticleObjects);
                // prepareArticlesHtml(ArticleObjects, nightMode)
                //   .then(ArticleObjects => {
                //     res.send(ArticleObjects);
                //   })
                //   .catch(error => {
                //     if (error)
                //       res.status(400).send(error);
                //   });
              },
              e => {
                res.status(400).send(e);
              }
            );
        }
      }
    })
    .catch(e => {
      console.log("Error finding User findByEmail(Correct Token)" + e);
      return res.send("Error finding User findByEmail(Correct Token)" + e);
    });
});

// async function prepareArticlesHtml(ArticleObjects, nightMode) {

//   ArticleObjects = await Promise.all(ArticleObjects.map(async articleObject => {
//     var html = await getHtml(articleObject, nightMode);

//     if (articleObject.body.length >= 250)
//       articleObject.body = articleObject.body.substring(0, 250) + "!h%s!" + html;
//     else
//       articleObject.body = articleObject.body + "!h%s!" + html;

//     return articleObject;
//   }));
//   return ArticleObjects;
// }

// async function getHtml(ArticleObject, nightMode) {
//   var date = dateFormat(ArticleObject.createdAt, "dd mmm yyyy");
//   try {
//     let html = await ejs.renderFile("./server/views/article.ejs", { ArticleObject, date, nightMode: nightMode });
//     return html;
//   } catch (error) {
//     throw error;
//   }

// }

module.exports = router;
