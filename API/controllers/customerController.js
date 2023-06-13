const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const Customer = require("../models/customerModel");
const AppError = require("../utils/appError");
const data2xml = require("data2xml");
const convert = data2xml({
  xmlHeader:
    '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n',
});

//Controllers

//Adds customer to database and creates an xml request for QB //* COMPLETE

exports.addCustomer = catchAsync(async (req, res, next) => {
  //Creating Data Clones and sanitizing the data
  let mongoNewCustomer = {
    Name: req.body.FullName,
    FullName: req.body.FullName,
    CompanyName: req.body.CompanyName,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    BillAddress: req.body.BillAddress,
    Phone: req.body.Phone,
    Email: req.body.Email,
  };
  let quickbooksNewCustomer = { ...mongoNewCustomer };
  delete quickbooksNewCustomer.FullName;

  //Creating a request to store on the Model
  Qbxml = convert("QBXML", {
    QBXMLMsgsRq: {
      _attr: { onError: "stopOnError" },
      CustomerAddRq: {
        CustomerAdd: quickbooksNewCustomer,
      },
    },
  });
  //adding request to the Model and creating a new customer in Mongo
  mongoNewCustomer.QBRequest = Qbxml;
  const doc = await Customer.create(mongoNewCustomer);
  //Returning data to front-end
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

//Edit Customers
exports.editCustomer = catchAsync(async (req, res, next) => {
  let editedCustomer = {
    ListID: req.body.ListID,
    EditSequence: req.body.EditSequence,
    Name: req.body.Name,
    FullName: req.body.FullName,
    CompanyName: req.body.CompanyName,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    BillAddress: req.body.BillAddress,
    Phone: req.body.Phone,
    Email: req.body.Email,
    Hidden: req.body.Hidden,
  };

  let qbxml;
  let qbxmlBody = { ...editedCustomer };
  //Creating a request to store on the Model if there is a ListID on the request if not create a customer
  //This allows for editting a customer that hasn't been synced with quickbooks yet.
  if (!req.body.ListID) {
    delete qbxmlBody.ListID;
    delete qbxmlBody.EditSequence;
    delete qbxmlBody.FullName;
    delete qbxmlBody.Hidden;
    qbxml = convert("QBXML", {
      QBXMLMsgsRq: {
        _attr: { onError: "stopOnError" },
        CustomerAddRq: {
          CustomerAdd: qbxmlBody,
        },
      },
    });
  } else {
    delete qbxmlBody.FullName;
    delete qbxmlBody.Hidden;
    qbxml = convert("QBXML", {
      QBXMLMsgsRq: {
        _attr: { onError: "stopOnError" },
        CustomerModRq: {
          CustomerMod: qbxmlBody,
        },
      },
    });
  }
  //Store Request on the model
  let doc = await Customer.findOneAndUpdate(
    { FullName: editedCustomer.FullName },
    {
      EditSequence: editedCustomer.EditSequence,
      Name: editedCustomer.Name,
      CompanyName: editedCustomer.CompanyName,
      FirstName: editedCustomer.FirstName,
      LastName: editedCustomer.LastName,
      BillAddress: editedCustomer.BillAddress,
      Phone: editedCustomer.Phone,
      Email: editedCustomer.Email,
      Hidden: false,
      QBRequest: qbxml,
      Synced: false,
    },
    {
      new: true,
    }
  );

  //adding request to the Model and creating a new customer in Mongo
  if (!doc) {
    return next(new AppError("No Customer found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
  });
});

//Not being used //todo Add front end functionality
//Delete customer changes the hidden status to true
exports.deleteCustomer = catchAsync(async (req, res, next) => {
  await Customer.findByIdAndUpdate(
    req.body._id,
    { Hidden: true },
    { new: true }
  );
  res.status(204).json({
    status: "success",
  });
});

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  searchFilter = { Hidden: { $ne: true } };
  if (req.query.ShowHidden === "true") {
    searchFilter = { Hidden: true };
  }
  let data = await Customer.find(searchFilter).select(
    "-QBRequest -Synced -__v"
  );
  res.status(200).json({
    status: "success",
    data,
  });
});

//Not being used. Might not need
//Get One Customer
exports.getOneCustomer = catchAsync(async (req, res, next) => {
  let data = await Customer.findById(req.params.id);
  if (!data) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});
