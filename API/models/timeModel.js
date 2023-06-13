const mongoose = require("mongoose");
const validator = require("validator");

const timeSchema = new mongoose.Schema({
  TxnLineID: String,
  WorkOrder: String,
  PONumber: Number,
  WOReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkOrder",
    required: true,
  },
  Employee: String,
  EmployeeReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },
  //todo Create specific fields for time in, out and lunch
  TimeData: [Date],
  //From quickbooks
  ItemRef: {
    ListID: String,
    FullName: String,
  },
  Desc: String,
  Quantity: { type: Number, required: true },
  Synced: {
    type: Boolean,
    default: false,
  },
  Completed: {
    type: Boolean,
    default: false,
  },
  ClassRef: {
    FullName: {
      type: String,
      enum: ["Construction", "Service"],
    },
  },
  Lunch: {
    type: Boolean,
    default: false,
  },
});
const Time = mongoose.model("Time", timeSchema);
module.exports = Time;
