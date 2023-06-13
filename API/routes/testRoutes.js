const express = require("express");
const router = express.Router();
const Test = require("../models/testModel");
const catchAsync = require("../utils/catchAsync");

router.route("/all").get(async (req, res, next) => {
  let data = await Test.find({});
  res.status(200).json({
    status: "success",
    data,
  });
  next();
});

router.route("/add").post(
  catchAsync(async (req, res, next) => {
    await Test.create(req.body).then((data) => {
      res.status(201).json({
        status: "success",
        data,
      });
      next();
    });
  })
);
// router.route("/getAll").get(
//   catchAsync(async (req, res, next) => {
//     await Test.find().then((data) => {
//       res.status(201).json({
//         status: "success",
//         data,
//       });
//       next();
//     });
//   })
// );

module.exports = router;
