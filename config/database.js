require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URL);
const database = mongoose.connection;

module.exports = database;
