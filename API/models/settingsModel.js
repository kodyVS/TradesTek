const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  workOrders: {
    title: {
      type: String,
      default: "Work Order Settings",
    },
    jobTypes: [
      {
        Name: String,
        Color: String,
        _id: false,
      },
    ],
    completed: {
      color: String,
    },
    reviewBeforeSync: { type: Boolean, default: true },
  },
  accounting: {
    title: {
      type: String,
      default: "Accounting Software",
    },
    softwares: {
      type: Array,
      default: ["Quickbooks Desktop", "QuickBooks Online", "None"],
    },
    softwareChoice: {
      type: String,
      default: "None",
    },
  },
  permissions: {
    title: {
      type: String,
      default: "Permissions",
    },
    roles: {
      type: Array,
      default: ["User", "Admin"],
    },
    access: {
      accessTimeSheet: {
        label: {
          type: String,
          default: "Access Timesheet Information",
        },
        roles: {
          type: Array,
          default: ["User"],
        },
      },
      timeSheetEdit: {
        label: { type: String, default: "Edit Timesheet Data" },
        roles: { type: Array, default: ["User"] },
      },
      createWorkOrder: {
        label: { type: String, default: "Create new work orders" },
        roles: { type: Array, default: ["admin", "User"] },
      },
      editWorkOrders: {
        label: { type: String, default: "Edit work orders" },
        roles: { type: Array, default: ["admin", "User"] },
      },
      uploadImages: {
        label: { type: String, default: "Upload images to work orders" },
        roles: { type: Array, default: ["admin", "User"] },
      },
      accessJobs: {
        label: { type: String, default: "View all jobs - read only" },
        roles: { type: Array, default: ["admin", "User"] },
      },
      manageJobInformation: {
        label: { type: String, default: "Edit/Create jobs " },
        roles: { type: Array, default: ["admin"] },
      },
      accessCustomers: {
        label: { type: String, default: "View all customers - read only" },
        roles: { type: Array, default: ["admin", "User"] },
      },
      manageCustomerInformation: {
        label: { type: String, default: "Edit/Create Customers" },
        roles: { type: Array, default: ["admin"] },
      },
    },
  },
});

const Settings = mongoose.model("settings", settingsSchema);
module.exports = Settings;
