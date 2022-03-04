const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const multer = require("multer");

const authRouter = require("./src/routes/auth");
const blogRouter = require("./src/routes/blog");

const app = express();

// START: Setup multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime().toString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(
  multer({
    storage,
    fileFilter,
  }).single("image")
);
// END: Setup multer

// START: Mengatasi CORS Policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  "/public/images",
  express.static(path.join(__dirname, "public/images"))
);
// END: Mengatasi CORS Policy

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const API = "/api/v1";
app.use(`${API}/auth`, authRouter);
app.use(`${API}/blog`, blogRouter);

app.use((error, req, res, next) => {
  const statusCode = error.errorStatus || 500;
  const message = error.message || "500 - Internal server error";
  const data = error.data || null;
  res.status(statusCode).json({
    status: "error",
    message,
    data,
  });
});

module.exports = app;
