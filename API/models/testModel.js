const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  Test1: String,
});

const test = mongoose.model("test", testSchema);
module.exports = test;
