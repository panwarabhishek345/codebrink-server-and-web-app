var express = require("express");
var router = express.Router();

var appDataController = require("./../controllers/app-data-controller");

//Get Android App latest version number
router.get("/AndroidAppData", appDataController.getAndroidAppData);

module.exports = router;
