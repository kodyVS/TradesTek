const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const Employee = require("../models/employeeModel");
const AppError = require("../utils/appError");
const data2xml = require("data2xml");

//todo Make the popuation a param sent by front end
exports.getAllEmployees = catchAsync(async (req, res, next) => {
  let filter = { Hidden: false };
  if (req.query) {
    if (req.query.ShowHidden === "true") {
      filter = {};
    }
  }
  let data = await Employee.find(filter)
    .select("-__V -Jobs ")
    .populate("WOReference")
    .sort({ Hidden: -1, Name: 1 });
  res.status(200).json({
    status: "success",
    data,
  });
});

//Not used //todo Add view employee to see more information on single employee
exports.getOneEmployee = catchAsync(async (req, res, next) => {
  let employee = await Employee.findById(req.params.id);
  if (!employee) {
    return next(new AppError("No Employee found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    employee,
  });
});

//Not used
exports.editEmployee = catchAsync(async (req, res, next) => {
  let newInfo = req.body;
  let employee = await Employee.findByIdAndUpdate(req.query.id, newInfo, {
    new: true,
  });
  if (!employee) {
    return next(new AppError("No employee found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    employee,
  });
});

//! Flagged for deletion but could still use
exports.addJob = catchAsync(async (req, res, next) => {
  let JobName = req.body.JobName;
  let employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { Jobs: JobName },
    },
    { new: true }
  );
  if (!employee) {
    return next(new AppError("No employee found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      Name: employee.Name,
      Id: employee._id,
      Jobs: employee.Jobs,
    },
  });
});

//! Flagged for deletion but could still use
exports.removeJob = catchAsync(async (req, res, next) => {
  let JobName = req.body.JobName;
  let employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { Jobs: JobName },
    },
    { new: true }
  );
  if (!employee) {
    return next(new AppError("No employee found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      Name: employee.Name,
      Id: employee._id,
      Jobs: employee.Jobs,
    },
  });
});
