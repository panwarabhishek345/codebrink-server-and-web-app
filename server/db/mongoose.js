var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/CodeBrinkdbApp");
mongoose.connect(
  "",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
  }
);

module.exports = { mongoose };
