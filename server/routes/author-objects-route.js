var express = require("express");
var router = express.Router();

var authorController = require("./../controllers/author-controller");

//Post an Author
router.post("/AuthorObjects", authorController.postAuthorObject);
//Get an Author
router.get("/AuthorObjects", authorController.getAuthorObject);

module.exports = router;
