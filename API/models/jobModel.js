const mongoose = require("mongoose");
const validator = require("validator");

const jobSchema = new mongoose.Schema({
  ListID: String,
  Name: String,
  EditSequence: String,
  FullName: {
    type: String,
    unique: [true, "Name must be unqiue"],
    trim: true,
    required: [true, "Name is required"],
  },
  ParentRef: {
    ListID: String,
    FullName: {
      type: String,
      required: true,
    },
  },
  Salutation: {
    type: String,
    default: "Mr",
  },
  FirstName: {
    type: String,
  },
  MiddleName: String,
  LastName: String,
  JobTitle: String,
  BillAddress: {
    Addr1: String,
    Addr2: String,
    City: String,
    State: String,
    PostalCode: {
      type: String,
    },
    Country: String,
  },
  Note: String,
  Phone: String,
  AltPhone: String,
  Fax: String,
  Email: {
    type: String,
  },
  Synced: {
    type: Boolean,
    default: false,
  },
  QBRequest: String,
  Hidden: Boolean,
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
