var express = require("express");
require("mongoose-pagination");
var router = express.Router();

var { ArticleObject } = require("./../models/ArticleObject");
var {
  setBookmarksAndLikes,
  prepareArticles
} = require("./../controllers/utils/set-user-properties");
const server_keys = require("./../config/server-keys");

var { GoogleUserObject } = require("./../models/GoogleUserObject");
const { authenticateGoogle } = require("./../middleware/authenticate.js");
const {
  getTrendingSearches
} = require("./../controllers/search-articles-controller.js");
const {
  postTrendingSearches
} = require("./../controllers/search-articles-controller.js");

var api_access_key_user = server_keys.api_access_key_user;
var api_access_key_admin = server_keys.api_access_key_admin;

var limit = 15;

router.get("/SearchArticles", (req, res) => {
  var key = req.header("api_access_key_user");
  var nightMode = req.header("nightMode");

  // if (key != api_access_key_user) {
  //   return res.status(400).send('Wrong client id. You are not authorised to use the api.');
  // }

  var query = req.query.q;
  var reqNext = req.header("reqNext");
  //
  // if(reqNext != null){
  //   ArticleObject.find({'_id':{'$lt':reqNext},$text: {$search: query}},{score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(limit).then((ArticleObjects) =>{
  //     res.send(ArticleObjects);
  //   }, (e) =>{
  //     res.status(400).send(e);
  //   });
  // }
  // else{
  //   ArticleObject.find({$text: {$search: query}},{score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(limit).then((ArticleObjects) =>{
  //     res.send(ArticleObjects);
  //   }, (e) =>{
  //     res.status(400).send(e);
  //   });
  // }

  if (reqNext == null) {
    reqNext = 1;
  }
  ArticleObject.find(
    {
      status: "published",
      type: { $ne: "web" },
      $text: { $search: query }
    },
    { score: { $meta: "textScore" } }
  )
    .populate("author")
    .paginate(reqNext, limit)
    .sort({ score: { $meta: "textScore" } })
    .exec(function(err, ArticleObjects) {
      if (err) return res.status(400).send(err);

      ArticleObjects = prepareArticles(ArticleObjects);
      res.send(ArticleObjects);

      // prepareArticlesHtml(ArticleObjects, nightMode)
      //   .then(ArticleObjects => {
      //     res.send(ArticleObjects);
      //   })
      //   .catch(error => {
      //     if (error)
      //       return res.status(400).send(error);
      //   });
    });
});

router.get("/googleUser/SearchArticles", authenticateGoogle, (req, res) => {
  var key = req.header("api_access_key_user");
  var nightMode = req.header("nightMode");

  if (key != api_access_key_user) {
    return res
      .status(400)
      .send("Wrong client id. You are not authorised to use the api.");
  } else {
    var query = req.query.q;
    var reqNext = req.header("reqNext");
    //
    // if(reqNext != null){
    //   ArticleObject.find({'_id':{'$lt':reqNext},$text: {$search: query}},{score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(limit).then((ArticleObjects) =>{
    //     res.send(ArticleObjects);
    //   }, (e) =>{
    //     res.status(400).send(e);
    //   });
    // }
    // else{
    //   ArticleObject.find({$text: {$search: query}},{score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(limit).then((ArticleObjects) =>{
    //     res.send(ArticleObjects);
    //   }, (e) =>{
    //     res.status(400).send(e);
    //   });
    // }

    if (reqNext == null) {
      reqNext = 1;
    }

    GoogleUserObject.findByEmail(req.email)
      .then(user => {
        if (!user) {
          console.log("User Not Found!");
          return res.send("User Not Found!");
        }
        console.log("User Found");

        ArticleObject.find(
          {
            status: "published",
            type: { $ne: "web" },
            $text: { $search: query }
          },
          { score: { $meta: "textScore" } }
        )
          .populate("author")
          .paginate(reqNext, limit)
          .sort({ score: { $meta: "textScore" } })
          .exec(function(err, ArticleObjects) {
            if (err) return res.status(400).send(err);

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
          });
      })
      .catch(e => {
        console.log("Error finding User findByEmail(Correct Token)" + e);
        return res.send("Error finding User findByEmail(Correct Token)" + e);
      });
  }
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

router.get("/TrendingSearches", getTrendingSearches);
router.post("/TrendingSearches", postTrendingSearches);

module.exports = router;
