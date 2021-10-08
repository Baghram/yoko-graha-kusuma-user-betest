const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router/index");
const url = process.env.MONGOURL;
const mongoose = require("mongoose");
mongoose.connect(url, {
  authSource: "admin",
  dbName: "db_yoko_betest",
});
const db = mongoose.connection;
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json());
db.once("error", console.error.bind(console, "connection Error:"));
db.once("open", () => {
  console.log("DB Connected");
});
app.use("/", router);

module.exports = app;
