const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog");
const { body } = require("express-validator");

router.post(
  "/post",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Input title minimal 5 karakter!"),
    body("body")
      .isLength({ min: 5 })
      .withMessage("Input body minimal 5 karakter!"),
  ],
  blogController.createBlogPost
);
router.get("/posts", blogController.getAllBlogPosts);
router.get("/post/:postId", blogController.getDetailBlogPost);
router.put(
  "/post/:postId",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Input title minimal 5 karakter!"),
    body("body")
      .isLength({ min: 5 })
      .withMessage("Input body minimal 5 karakter!"),
  ],
  blogController.updateBlogPost
);
router.delete("/post/:postId", blogController.deleteBlogPost);

module.exports = router;
