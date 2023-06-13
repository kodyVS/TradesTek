const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema({
  ListID: String,

  //todo Change it so Quickbooks Name/FullName is only stored once instead of twice
  Name: String,
  EditSequence: String,
  FullName: {
    type: String,
    required: [true, "name is required"],
    unique: true,
    trim: true,
  },
  Salutation: {
    type: String,
  },
  FirstName: {
    type: String,
  },
  MiddleName: String,
  LastName: String,

  //todo clarify what this is
  JobTitle: String,

  //Sets default on Addr1 so BillAddress always exists (stop a nesting error on front nend)
  BillAddress: {
    Addr1: {
      type: String,
      default: "",
    },
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
  QBRequest: String,
  Synced: { type: Boolean, default: false },

  //Hides customer from front-end if deleted
  Hidden: Boolean,
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
