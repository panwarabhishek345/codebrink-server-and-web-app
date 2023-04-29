var mongoose = require("mongoose");
var { AuthorObject } = require("./AuthorObject");
const validator = require("validator");

var ArticleObjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: function(value) {
        var count = (value.match(/%%/g) || []).length;
        return count == this.mediaObjects.length;
      },
      message: "Error! MediaObjects and their Placeholders are not equal!"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: false,
    trim: true,
    default: "draft"
    // validate: {
    //   validator: validator.isIn(value, ["draft", "published"]),
    //   message: "Error! Invalid Article Status value"
    // }
  },
  type: {
    type: String,
    enum: ["codebrink", "web"],
    default: "codebrink"
  },
  topic: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  subtopic: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  tags: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  videoURL: {
    type: String,
    required: false,
    trim: true
    // validate: {
    //   validator: validator.isURL,
    //   message: '{VALUE} is not a valid URL!'
    // }
  },
  articleImage: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: validator.isURL,
      message: "{VALUE} is not a valid URL!"
    }
  },
  rating: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  liked: {
    type: Boolean,
    default: false
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "AuthorObject",
    required: true
  },
  uploader: {
    type: mongoose.Schema.ObjectId,
    ref: "AuthorObject",
    default: "",
    required: true
  },
  mediaObjects: {
    type: [
      {
        objectType: {
          type: Number,
          required: true
        },
        content: {
          type: String,
          minlength: 1,
          trim: true
        },
        height: {
          type: Number,
          required: true
        },
        isFullScreenEnabled: {
          type: Boolean,
          default: true
        },
        codeCpp: {
          type: String,
          minlength: 1,
          trim: true
        },
        codeJava: {
          type: String,
          minlength: 1,
          trim: true
        }
      }
    ]
  }
});

// ArticleObjectSchema.index({ title: 'text',body: 'text',topic: 'text',subtopic: 'text',tags: 'text','author.name': 'text'});
ArticleObjectSchema.index(
  {
    title: "text",
    topic: "text",
    subtopic: "text",
    tags: "text",
    "author.name": "text"
  },
  {
    name: "My text index",
    weights: { title: 10, topic: 8, subtopic: 7, tags: 4, "author.name": 5 }
  }
);

ArticleObjectSchema.statics.removeRefs = function(articleId, cb) {
  Promise.all([
    this.model("AuthorObject")
      .updateMany({ $pull: { myArticles: articleId } })
      .exec(),
    this.model("GoogleUserObject")
      .updateMany({ $pull: { savedArticles: articleId } })
      .exec(),
    this.model("GoogleUserObject")
      .updateMany({ $pull: { likedArticles: articleId } })
      .exec(),
    this.model("Chapter")
      .updateMany({ $pull: { articles: articleId } })
      .exec()
  ])
    .then(cb)
    .catch(cb);
};

var ArticleObject = mongoose.model("ArticleObject", ArticleObjectSchema);
module.exports = { ArticleObject };
