const mongoose = require("mongoose");

const blogPostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title tidak boleh kosong"],
    },
    body: {
      type: String,
      required: [true, "Body tidak boleh kosong"],
    },
    image: {
      type: String,
      required: [true, "Image tidak boleh kosong"],
    },
    author: {
      type: Object,
      required: [true, "Author tidak boleh kosong"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogPostSchema);
