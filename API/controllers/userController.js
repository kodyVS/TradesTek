const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let token = req.headers.cookie.slice(4);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  let doc;
  if (decoded.UserRole === "admin") {
    doc = await User.find({ Active: true })
      .populate("EmployeeReference")
      .select("-Password");
  } else {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  res.status(201).json({
    status: "success",
    data: doc,
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  let doc = await User.findOne({
    Name: req.query.Name,
  })
    .populate("EmployeeReference")
    .select("-Password");
  res.status(201).json({
    status: "success",
    data: doc,
  });
});
exports.editUser = catchAsync(async (req, res, next) => {
  let token = req.headers.cookie.slice(4);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  if (decoded.id === req.query.id || decoded.UserRole === "admin") {
    let doc = await User.findByIdAndUpdate(req.query.id, req.body.user, {
      new: true,
    });
    console.log(doc);
  } else {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  res.status(201).json({
    status: "success",
  });
});
