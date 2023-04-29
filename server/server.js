const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
var compression = require("compression");
// const scheduleNews = require('./controllers/utils/news');
var cors = require("cors");
var { mongoose } = require("./db/mongoose");
var routes = require('./routes/index');

const rootDir = path.join(__dirname, '../');

var app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "server/views");

app.use(express.static(path.join(rootDir, 'public')));
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    return false;
  }
  return compression.filter(req, res);
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Origin, X-Requested-With, Content-Type, Accept,api_access_key_user,api_access_key_admin"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

// app.use(require("./routes/courses/courses-menu"));

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = { app };
