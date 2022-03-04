const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog");

exports.createBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    let err = new Error("Image harus diunggah");
    err.errorStatus = 422;
    throw err;
  }

  const { title, body } = req.body;
  const image = req.file.path;

  const payload = {
    title,
    body,
    image,
    author: {
      uid: 1,
      name: "Gusman Wijaya",
    },
  };

  const posting = new Blog(payload);
  posting
    .save()
    .then((result) => {
      res.status(201).json({
        status: "success",
        message: "Create Blog Post Success",
        data: result,
      });
    })
    .catch((error) => next(error));
};

exports.getAllBlogPosts = (req, res, next) => {
  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 5;
  let totalItems;

  Blog.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Blog.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Data blog post berhasil dipanggil",
        data: result,
        total_data: totalItems,
        page: currentPage,
        per_page: perPage,
      });
    })
    .catch((error) => next(error));
};

exports.getDetailBlogPost = (req, res, next) => {
  const { postId } = req.params;
  Blog.findById(postId)
    .then((result) => {
      if (!result) {
        let err = new Error("Blog post tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      } else {
        res.status(200).json({
          status: "success",
          message: `Data blog post dengan id: ${postId} berhasil dipanggil`,
          data: result,
        });
      }
    })
    .catch((error) => next(error));
};

exports.updateBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    let err = new Error("Image harus diunggah");
    err.errorStatus = 422;
    throw err;
  }

  const { postId } = req.params;
  const { title, body } = req.body;
  const image = req.file.path;

  Blog.findById(postId)
    .then((post) => {
      if (!post) {
        let err = new Error("Blog post tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      } else {
        post.title = title;
        post.body = body;
        post.image = image;
        return post.save();
      }
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: `Blog post dengan id: ${postId} berhasil diubah`,
        data: result,
      });
    })
    .catch((error) => next(error));
};

exports.deleteBlogPost = (req, res, next) => {
  const { postId } = req.params;
  Blog.findById(postId)
    .then((post) => {
      if (!post) {
        let err = new Error("Blog post tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      } else {
        removeImage(post.image);
        return Blog.findByIdAndDelete(postId);
      }
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Blog post berhasil dihapus",
        data: result,
      });
    })
    .catch((error) => next(error));
};

const removeImage = (filePath) => {
  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, (error) => console.log(error));
};
