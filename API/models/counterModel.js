const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  Count: Number,
  hello: String,
});

const Counter = mongoose.model("Counter", counterSchema);
module.exports = Counter;
