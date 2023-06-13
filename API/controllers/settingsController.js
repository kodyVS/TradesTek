const Settings = require("./../models/settingsModel");
const factory = require("./factoryHandler");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getSettings = catchAsync(async (req, res, next) => {
  let data = await Settings.findById("5fd031eb75b3c84d5c3b52e6");
  if (!data) {
    return new AppError("No settings found", 404);
  }
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.editSettings = factory.updateOne(Settings);
exports.createSettings = factory.createOne(Settings);
