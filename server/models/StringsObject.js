var mongoose = require("mongoose");

var StringsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true
  },
  strings: [
    {
      type: String
    }
  ]
});

var StringsObject = mongoose.model("StringsObject", StringsSchema);
module.exports = { StringsObject };
