var { Chapter } = require("./../../models/Courses/Chapter");
var { GoogleUserObject } = require("./../../models/GoogleUserObject");
var { setBookmarksAndLikes } = require("./../utils/set-user-properties");

module.exports.postChapter = (req, res) => {
  var newChapter = new Chapter({
    name: req.body.name,
    desc: req.body.desc,
    chapterImage: req.body.chapterImage,
    fromCourse: req.body.fromCourse,
    status: "draft"
  });

  newChapter.save().then(
    chapter => {
      res.send(chapter);
    },
    err => {
      console.log("Unable to create the Chapter ", err);
      res.status(400).send("Unable to create the Chapter " + err);
    }
  );
};

module.exports.deleteChapter = (req, res) => {
  let chapterId = req.header("chapterId");

  if (!chapterId) {
    return res.status(400).send("Please specify the chapterId.");
  }

  Chapter.findOneAndDelete({ _id: chapterId })
    .then(removed => {
      Chapter.removeRefs(chapterId);
      return res.send("Chapter Removed Successfully.");
    })
    .catch(err => {
      console.log(err);
      return res
        .status(401)
        .send("Error Occurred while deleting the Chapter. " + err);
    });
};

module.exports.getChapter = (req, res) => {
  let chapterId = req.header("chapterId");
  if (!chapterId) res.status(400).send("Please provide the chapter id.");

  Chapter.findOne({ _id: chapterId })
    .populate("fromCourse", "name")
    .populate("articles", "title")
    .then(
      chapter => {
        if (!chapter) return res.send("No chapter found!");
        return res.send(chapter);
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the chapter. " + e);
      }
    );
};

module.exports.getAllChapters = (req, res) => {
  Chapter.find()
    .sort({ _id: -1 })
    .then(
      chapters => {
        if (!chapters) return res.send("No chapters found!");
        return res.send(chapters);
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the chapters. " + e);
      }
    );
};

module.exports.addArticle = (req, res) => {
  let chapterId = req.header("chapterId");
  let articleId = req.header("articleId");
  let index = req.header("index");

  if (!chapterId || !articleId || !index)
    res.status(400).send("Course id or Chapter id or index is missing.");

  Chapter.findOne({ _id: chapterId })
    .populate("fromCourse", "name")
    .then(
      chapter => {
        if (!chapter) return res.send("No chapter found!");

        let articles = chapter.articles;
        let i = articles.indexOf(articleId);
        if (i == -1) {
          if (index > articles.length)
            return res
              .status(401)
              .send("index is greater than the articles array length");
          else {
            if (index == -1) articles.push(articleId);
            else articles.splice(index, 0, articleId);
            chapter
              .save()
              .then(chapterSaved => {
                return res.send(chapterSaved);
              })
              .catch(err => {
                console.log(
                  "Error while saving the chapter after adding an article " +
                    err
                );
                res.status(401).send(err);
              });
          }
        } else {
          return res.send(
            "Article already exists in the chapter please delete it first."
          );
        }
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the Chapter. " + e);
      }
    );
};

module.exports.deleteArticle = (req, res) => {
  let chapterId = req.header("chapterId");
  let articleId = req.header("articleId");

  if (!chapterId || !articleId)
    res.status(400).send("Course id or Article id is missing.");

  Chapter.findOne({ _id: chapterId })
    .populate("fromCourse", "name")
    .then(
      chapter => {
        if (!chapter) return res.send("Chapter not found!");

        let articles = chapter.articles;
        let i = articles.indexOf(articleId);
        if (i == -1) {
          return res.send("Article doesnt exist in this chapter.");
        } else {
          articles.splice(i, 1);
          chapter
            .save()
            .then(chapterSaved => {
              return res.send(chapterSaved);
            })
            .catch(err => {
              console.log(
                "Error while saving the chapter after deleting an article " +
                  err
              );
              res.status(401).send(err);
            });
        }
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the chapter. " + e);
      }
    );
};

module.exports.deleteAllArticles = (req, res) => {
  let chapterId = req.header("chapterId");

  if (!chapterId) res.status(400).send("Chapter id is missing.");

  Chapter.findOne({ _id: chapterId })
    .populate("fromCourse", "name")
    .then(
      chapter => {
        if (!chapter) return res.send("Chapter not found!");

        chapter.articles = [];
        chapter
          .save()
          .then(chapterSaved => {
            return res.send(chapterSaved);
          })
          .catch(err => {
            console.log(
              "Error while saving the chapter after deleting an article " + err
            );
            res.status(401).send(err);
          });
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the chapter. " + e);
      }
    );
};

module.exports.getChapterArticles = (req, res) => {
  let chapterId = req.header("chapterId");
  let reqNext = req.header("reqNext");
  let limit = 15;

  if (!chapterId) res.status(400).send("Chapter id is missing.");

  Chapter.findOne({ _id: chapterId, type: { $ne: "web" } })
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

// Returns a list of article names in a chapter
module.exports.getChapterArticlesList = (req, res) => {
  let chapterId = req.header("chapterId");
  let reqNext = req.header("reqNext");
  let limit = 15;

  if (!chapterId) res.status(400).send("Chapter id is missing.");

  Chapter.findOne({ _id: chapterId })
    .populate("articles", "title")
    .then(
      chapter => {
        if (!chapter) return res.send("Chapter not found!");
        let startingIndex = reqNext * limit;
        chapter.articles = chapter.articles.map((a, index) =>
          a.set("index", startingIndex + index, { strict: false })
        );
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

      Chapter.findOne({ _id: chapterId, type: { $ne: "web" } })
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
