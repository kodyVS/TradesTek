//todo move image uploads to a new controller

const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const WorkOrder = require("../models/workOrderModel");
const User = require("../models/userModel");
const Counter = require("../models/counterModel");
const AppError = require("../utils/appError");
const data2xml = require("data2xml");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Time = require("../models/timeModel");
const { cloudinary } = require("../Utils/cloudinary");
const path = require("path");
const DatauriParser = require("datauri/parser");
const convert = data2xml({
  xmlHeader:
    '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n',
});

//multer

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");
exports.uploadSinglePhoto = upload;
const parser = new DatauriParser();
// const dataUri = (req) =>
//   dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
//const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// };

//Upload document file
exports.uploadImage = catchAsync(async (req, res, next) => {
  let data;
  console.log(req.body);
  try {
    //parsing buffer into a base64 string
    const file = parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;

    if (req.body.modelName === "WorkOrder") {
      let uploadedResponse = await cloudinary.uploader.upload(file, {
        upload_preset: "workorderfiles",
      });
      await WorkOrder.findByIdAndUpdate(
        req.body._id,
        { $push: { Images: uploadedResponse } },
        { new: true }
      ).catch((err) => {
        console.log(err);
      });

      data = uploadedResponse;
    }
    if (req.body.modelName === "user") {
      let uploadedResponse = await cloudinary.uploader.upload(file, {
        upload_preset: "userFiles",
      });
      let splitURL = uploadedResponse.url.split("/upload/");
      uploadedResponse.iconURL =
        splitURL[0] + "/upload/w_150,h_150,c_fill,g_face,r_max/" + splitURL[1];
      await User.findByIdAndUpdate(
        req.body._id,
        { Photo: uploadedResponse },
        { new: true }
      ).catch((err) => {
        console.log(err);
      });

      data = uploadedResponse;
    }
  } catch (error) {
    data = error;
    console.log(error);
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  let workOrderID = req.body.WorkOrderID;
  let imageID = req.body.ImagePublicID;

  let workOrder = await WorkOrder.findByIdAndUpdate(
    workOrderID,
    { $pull: { Images: { public_id: imageID } } },
    { new: true }
  );
  if (!workOrder) {
    return new AppError("No document found with that Id", 404);
  }

  let cloudinaryResponse = await cloudinary.uploader.destroy(imageID);

  console.log(cloudinaryResponse);

  res.status(204).json({
    status: "success",
    data: { status: "Hidden" },
  });
});
//todo Handle when work order is completed with quickbooks better !Important

exports.addWorkOrder = catchAsync(async (req, res, next) => {
  let PONumber;
  let newWorkOrder = { ...req.body };

  //Creating the PO Number and increase the count by one.
  await Counter.findByIdAndUpdate(
    { _id: "5f650840a2ae1d521cdb1a42" },
    { $inc: { Count: 1 } },
    { new: true }
  ).then((result) => {
    PONumber = result.Count;
  });

  newWorkOrder.PONumber = PONumber;

  const doc = await WorkOrder.create(newWorkOrder);

  //Returning data to Front-End with created status code
  //todo could remove the returning of the data. but nice to have for front-end debugging
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.editWorkOrder = catchAsync(async (req, res, next) => {
  let editedWorkOrder = { ...req.body };
  //Update Model with new info
  await WorkOrder.findByIdAndUpdate(
    editedWorkOrder.WorkOrderId,
    editedWorkOrder,
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    data: {
      data: "WorkOrder successfully edited",
    },
  });
});

exports.deleteWorkOrder = catchAsync(async (req, res, next) => {
  let deletedWO = await WorkOrder.findById(req.body._id);
  if (deletedWO.TimeReference) {
    if (deletedWO.TimeReference.length > 0) {
      console.log("time data is present");
      console.log(deletedWO.TimeReference);
      return next(
        new AppError(
          "Could not delete. This work order has time attached to it.",
          400
        )
      );
    }
  }
  await WorkOrder.findByIdAndDelete(deletedWO._id);
  res.status(204).json({
    status: "success",
    data: { status: "Hidden" },
  });
});

// Complete a work order and send time data to quickbooks and create invoice data
//todo Add functionailty for work orders that are completed, then marked incomplete again later
//todo In the map functions add the statement (if timestamp.Complete === false)
exports.completeWorkOrder = catchAsync(async (req, res, next) => {
  let workOrder = req.body;
  let InvoiceLineAdd = [];
  let totalTime = 0;
  let token = req.headers.cookie.slice(4);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (decoded.UserRole === "admin") {
    await WorkOrder.findById(workOrder.WorkOrderID)
      .populate("TimeReference")
      .populate("Job")
      .then(async (filledWO) => {
        //If the work order is labeled construction add the total time and create an invoice line based off title of work order
        if (filledWO.JobType === "Construction") {
          filledWO.TimeReference.map((timeStamp) => {
            if (timeStamp.Complete === false) {
              totalTime = totalTime + timeStamp.Quantity;
            }
          });

          if (totalTime === 0) {
            return new AppError(
              "No time has been added to this work order",
              400
            );
          }
          totalTime = Math.round((totalTime / 60 + Number.EPSILON) * 100) / 100;
          //reference to the quickbooks payment lines
          //todo be able to pull this itemRef from quickbooks and automatically populate it here
          InvoiceLineAdd = {
            ItemRef: {
              ListID: "80000008-1597162251",
              FullName: "Hourly Rate",
            },
            Desc: filledWO.Name,
            Quantity: totalTime,
            ClassRef: { FullName: "Construction" },
            SalesTaxCodeRef: { ListID: "80000001-1597162222", FullName: "G" },
          };
        }
        //if the job is a service call, add every time individually to the invoice with the description on the time
        if (filledWO.JobType === "Service") {
          filledWO.TimeReference.map((timeStamp) => {
            if (timeStamp.Complete === false) {
              totalTime =
                Math.round((timeStamp.Quantity / 60 + Number.EPSILON) * 100) /
                100;
              InvoiceLineAdd.push({
                ItemRef: {
                  ListID: "80000008-1597162251",
                  FullName: "Hourly Rate",
                },
                Desc: timeStamp.Desc,
                Quantity: totalTime,
                ClassRef: { FullName: "Service" },
                SalesTaxCodeRef: {
                  ListID: "80000001-1597162222",
                  FullName: "G",
                },
              });
            }
            if (InvoiceLineAdd.length === 0) {
              return new AppError(
                "No time data entered for this work order, work orders must have time before completed",
                400
              );
            }
          });
        }

        let qbxml;
        //Creating a request to store on the Model if there is a ListID on the request
        qbxml = convert("QBXML", {
          QBXMLMsgsRq: {
            _attr: { onError: "stopOnError" },
            InvoiceAddRq: {
              InvoiceAdd: {
                CustomerRef: {
                  FullName: filledWO.Job.FullName,
                },
                ClassRef: {
                  FullName: filledWO.JobType,
                },
                PONumber: filledWO.PONumber,
                InvoiceLineAdd: InvoiceLineAdd,
              },
            },
          },
        });
        //Mark all the time data as completed/billed so after we sync to quickbooks they won't be found again
        await Time.updateMany(
          { WOReference: filledWO._id },
          { Completed: true }
        ).then(() => {});

        //Store Request on the model
        filledWO.QBRequest = qbxml;
        filledWO.Synced = false;
        filledWO.save();
        //Send a Success message

        res.status(201).json({
          status: "success",
          data: "completed",
        });
      });
  } else if (decoded.UserRole === "User") {
    await WorkOrder.findByIdAndUpdate(
      workOrder.WorkOrderID,
      {
        IsPending: true,
      },
      { new: true }
    )
      .then(() => {
        res.status(201).json({
          status: "success",
          data: "completed",
        });
      })
      .catch((error) => {
        return new AppError(error, 400);
      });
  }
  //Find the work order by ID and populate the times and the job data
});

//Get One Work Order
exports.getOneWorkOrder = catchAsync(async (req, res, next) => {
  //find by id and populate all the data associated with the work order
  let populateFilter = "";
  if (req.query.TimePopulation === "true") {
    populateFilter = {
      path: "TimeReference",
      populate: {
        path: "EmployeeReference",
        select: "Name",
      },
    };
  }
  let query = WorkOrder.findById(req.params.id)
    .populate(populateFilter)
    .populate("Job");
  let doc = await query;
  if (!doc) {
    return next(new AppError("No Work Order found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.getAllWorkOrders = catchAsync(async (req, res, next) => {
  let searchFilter = { Complete: true };
  let complete;
  if (req.query.SearchText) {
    if (req.query.Complete === "true") {
      complete = true;
    } else if (req.query.Complete === "false") {
      complete = false;
    }
    let skip =
      (parseInt(req.query.Page) - 1) * parseInt(req.query.ItemsPerPage);
    let limit = parseInt(req.query.ItemsPerPage);
    let pipeline = [
      {
        $lookup: {
          from: "jobs",
          localField: "Job",
          foreignField: "_id",
          as: "Job",
        },
      },
      {
        $match: {
          $and: [
            { Complete: complete },
            {
              $or: [
                {
                  Name: {
                    $regex: req.query.SearchText,
                    $options: "i",
                  },
                },
                {
                  Description: {
                    $regex: req.query.SearchText,
                    $options: "i",
                  },
                },
                {
                  Employees: {
                    $regex: req.query.SearchText,
                    $options: "i",
                  },
                },
                {
                  JobType: {
                    $regex: req.query.SearchText,
                    $options: "i",
                  },
                },
                {
                  "Job.FullName": {
                    $regex: req.query.SearchText,
                    $options: "i",
                  },
                },
                {
                  PONumber: {
                    $regex: req.query.SearchText,
                    $options: "i",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        $unset: "TimeReference",
      },
      { $sort: { PONumber: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: 1 } }],
          workOrders: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ];
    await WorkOrder.aggregate(pipeline).then((data) => {
      data[0].workOrders.map((workOrder) => {
        workOrder.Job = workOrder.Job[0];
      });

      res.status(200).json({
        status: "success",
        data: data[0],
      });
    });
  } else {
    await WorkOrder.find(searchFilter)
      .select("-TimeReference")
      .sort({ PONumber: -1 })
      .populate("Job")
      .then((data) => {
        res.status(200).json({
          status: "success",
          data: { workOrders: data },
        });
      });
  }
});

exports.getAllActiveWorkOrders = catchAsync(async (req, res, next) => {
  let rangeFilter1;
  let rangeFilter2;
  let searchFilter = { Complete: false };
  if (req.query.Name) {
    searchFilter.Employees = req.query.Name;
  }
  if (req.query.LowRange) {
    let lowRange = req.query.LowRange;
    let highRange = req.query.HighRange;
    searchFilter.$or = [
      {
        $and: [
          { StartDate: { $gte: lowRange } },
          { StartDate: { $lte: highRange } },
        ],
      },
      {
        $and: [
          { EndDate: { $lte: highRange } },
          { EndDate: { $gte: lowRange } },
        ],
      },
      {
        $and: [
          { StartDate: { $lte: lowRange } },
          { EndDate: { $gte: highRange } },
        ],
      },
    ];
  }
  await WorkOrder.find(searchFilter)
    .select("-TimeReference")
    .sort({ PONumber: -1 })
    .populate("Job")
    .then((data) => {
      res.status(200).json({
        status: "success",
        data,
      });
    });
});
