const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  session: {
    type: String,
    required: true
  },
  categories: {
    type: String,
  },
  status: {
    type: String,
    required: true
  },
  userID: {
    type: String,
  },
  abstract: {
    type: String,
  },
  linkpdf: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

paperSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      strict: true,
      lower: true,
    });
  }
  if (this.abstract) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.abstract));
  }
  next();
});

module.exports = mongoose.model("Paper", paperSchema);
