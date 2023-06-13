//Not Used Atm

const mongoose = require("mongoose");

qbxmlModel = new mongoose.Schema({
  FullName: String,
  Qbxml: String,
});

const QbxmlRq = mongoose.model("QbxmlRq", qbxmlModel);
module.exports = QbxmlRq;
