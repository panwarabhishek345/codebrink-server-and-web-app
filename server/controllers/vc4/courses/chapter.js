var { Chapter } = require("./../../../models/Courses/Chapter");
var { GoogleUserObject } = require("./../../../models/GoogleUserObject");
var { setBookmarksAndLikes } = require("./../../utils/set-user-properties");

module.exports.getChapterArticles = (req, res) => {
  let chapterId = req.header("chapterId");
  let reqNext = req.header("reqNext");
  let limit = 15;

  if (!chapterId) res.status(400).send("Chapter id is missing.");

  Chapter.findOne({ _id: chapterId })
    .populate({
      path: "articles",
      populate: {
        path: "author"
      }
    })
    .then(
      chapter => {
        if (!chapter) return res.send("Chapter not found!");
        let startingIndex = reqNext * limit;
        return res.send(
          chapter.articles.slice(startingIndex, startingIndex + limit)
        );
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the chapter. " + e);
      }
    );
};

module.exports.getChapterArticlesGoogle = (req, res) => {
  let chapterId = req.header("chapterId");
  let reqNext = req.header("reqNext");
  let limit = 15;

  if (!chapterId) res.status(400).send("Course id is missing.");

  GoogleUserObject.findByEmail(req.email)
    .then(user => {
      if (!user) {
        console.log("User Not Found!");
        return res.send("User Not Found!");
      }

      Chapter.findOne({ _id: chapterId })
        .populate({
          path: "articles",
          populate: {
            path: "author"
          }
        })
        .then(
          chapter => {
            if (!chapter) return res.send("Chapter not found!");
            let startingIndex = reqNext * limit;
            let articles = chapter.articles.slice(
              startingIndex,
              startingIndex + limit
            );
            articles = setBookmarksAndLikes(articles, user);
            return res.send(articles);
          },
          e => {
            return res
              .status(401)
              .send("Error occurred while finding the chapter. " + e);
          }
        );
    })
    .catch(e => {
      console.log("Error finding User findByEmail(Correct Token)" + e);
      return res.send("Error finding User findByEmail(Correct Token)" + e);
    });
};
