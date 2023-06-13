const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  ListID: String,
  Name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
    trim: true,
  },
  FirstName: String,
  LastName: String,

  //Not sure what this does (QBdata)
  ActiveStatus: Boolean,

  EditSequence: String,
  JobTitle: String,
  Phone: String,
  Mobile: String,
  Email: String,

  //todo add more types once employeeEdit is built
  EmployeePosition: {
    type: String,
    enum: ["Field", "Office"],
    default: "Field",
  },

  //todo Create a way to have user create more enums for there company
  FieldType: {
    type: String,
    enum: ["Plumber", "HVAC", "Laborer"],
    default: "Plumber",
  },
  //currently not in use
  Jobs: [],

  //Used to track if employee is currently timed in.
  TimedIn: Boolean,
  TimeReference: "String",
  WOReference: { type: mongoose.Schema.Types.ObjectId, ref: "WorkOrder" },
  Lunch: { type: Boolean },
  Hidden: {
    type: Boolean,
    default: false,
  },
});

//! Change Employees to Employee
const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
