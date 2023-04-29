var { ArticleObject } = require("./../../models/ArticleObject");
var schedule = require("node-schedule");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("27678ed40feb4233b2e4114cc959fe61");

module.exports.scheduleNews = schedule.scheduleJob("*/5 * * * *", function() {
  console.log("News Called");
  newsapi.v2
    .topHeadlines({
      language: "en",
      sources: "hacker-news,techcrunch,recode"
    })
    .then(response => {
      ArticleObject.deleteMany({ topic: "GoogleNews" })
        .then(deleted => {
          // saveNewsArticles(response.articles);
        })
        .catch(err => {
          console.log(
            "Some error occurred while deleteing google news articles." + err
          );
        });
    });
});

const saveNewsArticles = function(articles) {
  let newArticles = articles
    .filter(article => article.urlToImage)
    .map(article => {
      return new ArticleObject({
        title: article.title,
        body: article.url,
        topic: "GoogleNews",
        subtopic: "GoogleNews",
        type: "web",
        tags: "GoogleNews,news",
        articleImage: article.urlToImage,
        rating: 0,
        likes: 0,
        mediaObjects: [],
        author: "", //web or internet
        uploader: "", //codebrink
        views: 0,
        status: "published",
        createdAt: article.publishedAt
      });
    });

  ArticleObject.insertMany(newArticles, function(err, article) {
    if (err) {
      console.log("Error occurred while saving new article", err);
    }
    console.log(article);
  });
};
