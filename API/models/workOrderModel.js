const mongoose = require("mongoose");
const validator = require("validator");

const workOrderSchema = new mongoose.Schema({
  Name: String,
  Job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  Description: String,
  JobType: {
    Name: {
      type: String,
    },
    Color: { type: String },
  },
  Complete: {
    type: Boolean,
    default: false,
  },
  IsPending: {
    type: Boolean,
    default: false,
  },
  Employees: {
    type: Array,
  },
  QBRequest: String,
  Synced: {
    type: Boolean,
    default: true,
  },
  Hidden: Boolean,
  PONumber: {
    type: String,
    required: true,
    unique: true,
  },
  TotalMinutes: Number,
  Images: [
    {
      asset_id: String,
      public_id: String,
      version: Number,
      version_id: String,
      signature: String,
      width: Number,
      height: Number,
      format: String,
      resource_type: String,
      created_at: String,
      tags: [],
      bytes: Number,
      etag: String,
      placeholder: Boolean,
      url: String,
      secure_url: String,
      access_mode: String,
    },
  ],

  //Quickbooks data
  TxnID: String,
  TimeCreated: String,
  EditSequence: String,
  TxtNumber: Number,
  CustomerRef: {
    ListID: String,
    FullName: String,
  },
  StartDate: {
    type: Date,
  },
  EndDate: { type: Date },
  IncludesTime: { type: Boolean },
  //I store all the time references on this model
  TimeReference: [{ type: mongoose.Schema.Types.ObjectId, ref: "Time" }],
  //"ARAccountRef": {
  // ListID: String,
  //FullName: String
  //}
});

const WorkOrder = mongoose.model("WorkOrder", workOrderSchema);
module.exports = WorkOrder;
