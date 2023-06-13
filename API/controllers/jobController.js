const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const Job = require("../models/jobModel");
const AppError = require("../utils/appError");
const data2xml = require("data2xml");
const convert = data2xml({
  xmlHeader:
    '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n',
});

//Add Job //* COMPLETED
exports.addJob = catchAsync(async (req, res, next) => {
  //Creating Data Clones
  let newJob = {
    Name: req.body.Name,
    FullName: req.body.FullName,
    ParentRef: req.body.ParentRef,
    CompanyName: req.body.CompanyName,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    BillAddress: req.body.BillAddress,
    Phone: req.body.Phone,
    Email: req.body.Email,
  };

  //Creating a request to store on the Model
  Qbxml = convert("QBXML", {
    QBXMLMsgsRq: {
      _attr: { onError: "stopOnError" },
      CustomerAddRq: {
        CustomerAdd: {
          Name: newJob.Name,
          ParentRef: newJob.ParentRef,
          FirstName: newJob.FirstName,
          LastName: newJob.LastName,
          BillAddress: newJob.BillAddress,
          Phone: newJob.Phone,
          Email: newJob.Email,
        },
      },
    },
  });
  //adding request to the Model and creating a new Job in Mongo
  newJob.QBRequest = Qbxml;
  const doc = await Job.create(newJob);

  //Returning data to Front-End
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
  //Errors will be handled by errorController
});

//Edit Job //* COMPLETED
exports.editJob = catchAsync(async (req, res, next) => {
  //Making sure the only data fields are the ones I want
  let editedJob = {
    ListID: req.body.ListID,
    FullName: req.body.FullName,
    EditSequence: req.body.EditSequence,
    Name: req.body.Name,
    ParentRef: req.body.ParentRef,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    BillAddress: req.body.BillAddress,
    Phone: req.body.Phone,
    Email: req.body.Email,
    Hidden: req.body.Hidden,
  };
  //Format xml
  let qbxml;

  //Creating an add request to store on the Model if there is a ListID on the request
  if (!req.body.ListID) {
    qbxml = convert("QBXML", {
      QBXMLMsgsRq: {
        _attr: { onError: "stopOnError" },
        CustomerAddRq: {
          CustomerAdd: {
            Name: editedJob.Name,
            ParentRef: editedJob.ParentRef,
            FirstName: editedJob.FirstName,
            LastName: editedJob.LastName,
            BillAddress: editedJob.BillAddress,
            Phone: editedJob.Phone,
            Email: editedJob.Email,
          },
        },
      },
    });
  } else {
    qbxml = convert("QBXML", {
      QBXMLMsgsRq: {
        _attr: { onError: "stopOnError" },
        CustomerModRq: {
          CustomerMod: {
            ListID: editedJob.ListID,
            EditSequence: editedJob.EditSequence,
            Name: editedJob.Name,
            ParentRef: editedJob.ParentRef,
            FirstName: editedJob.FirstName,
            LastName: editedJob.LastName,
            BillAddress: editedJob.BillAddress,
            Phone: editedJob.Phone,
            Email: editedJob.Email,
          },
        },
      },
    });
  }
  //Store Request on the model
  editedJob.QBRequest = qbxml;
  editedJob.Synced = false;

  let doc = await Job.findOneAndUpdate(
    { FullName: editedJob.FullName },
    editedJob,
    {
      new: true,
    }
  );
  if (!doc) {
    return next(new AppError("No Job found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: "Job successfully edited",
    },
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  await Job.findOneAndUpdate(
    { _id: req.body._id },
    { Hidden: true },
    { new: true }
  );
  res.status(204).json({
    status: "success",
  });
});

//Get all Jobs
exports.getAllJobs = catchAsync(async (req, res, next) => {
  //Finds all Jobs and sorts by Customer
  let filter = { Hidden: { $ne: true } };
  if (req.query.ShowHidden === "true") {
    filter = { Hidden: true };
  }
  await Job.find(filter)
    .sort({ "ParentRef.FullName": 1 })
    .then((data) => {
      res.status(200).json({
        status: "success",
        data,
      });
    });
});

//Not used and probably won't be. But will keep around for future use
exports.getOneJob = catchAsync(async (req, res, next) => {
  let doc = await Job.findById(req.params.id);

  if (!doc) {
    return next(new AppError("No Job found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
