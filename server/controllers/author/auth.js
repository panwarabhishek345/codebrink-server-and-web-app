var { AuthorObject } = require("./../../models/AuthorObject");

module.exports.sendDashboard = (req, res) => {
  AuthorObject.findOne({ email: req.email }).then(
    author => {
      if (author && author.verified == true) {
        return res.render("author/dashboard", {
          page: "myArticles",
          myArticles: null
        });
      }
      return res.render("author/error", {
        message: "You are not a verified author yet."
      });
    },
    e => {
      return res.render("author/error", {
        message: "Please try to login again."
      });
    }
  );
};

module.exports.sendTutorialPage = (req, res) => {
  return res.render("author/tutorial");
};
