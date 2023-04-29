var express = require("express");
var router = express.Router();

var articleCategoryController = require("./../controllers/article-category-controller");

//Post a new Category for the Articles
router.post("/CategoryObjects", articleCategoryController.postCategoryObjects);
//Get all the article Categories in the Popular Section of the Codebrink Android App
router.get("/CategoryObjects", articleCategoryController.getCategoryObjects);

module.exports = router;
