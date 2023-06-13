const Customer = require("../../models/customerModel");
const Job = require("../../models/jobModel");
const Employee = require("../../models/employeeModel");
const WorkOrder = require("../../models/workOrderModel");

exports.addWorkOrders = async (JSONResponse) => {
  await WorkOrder.findOneAndUpdate(
    { PONumber: JSONResponse.PONumber },
    JSONResponse,
    { new: true }
  );
};

//Imports customer data into app from quickbooks on every sync
//creates new customer in app when it can't find the fullname
exports.addAllCustomers = async (JSONResponse) => {
  JSONResponse.map(async (object) => {
    let updatedData = object;
    try {
      //! Use ListID instead of FullName to allow for changes to the Names
      //todo Make this one database query and just create the customer if findOneAndUpdate returns a cannot find Model Error.
      if (object.FullName === object.Name) {
        if (await Customer.findOne({ FullName: object.FullName })) {
          await Customer.findOneAndUpdate(
            { FullName: object.FullName },
            updatedData,
            { new: true }
          );
        } else {
          await Customer.create(updatedData);
        }
      } else {
        //! Use ListID instead of FullName to allow for changes to the Names
        //todo Make this one database query and just create the customer if findOneAndUpdate returns a cannot find Model Error.
        if (await Job.findOne({ FullName: object.FullName })) {
          await Job.findOneAndUpdate(
            { FullName: object.FullName },
            updatedData,
            { new: true }
          );
        } else {
          await Job.create(updatedData);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};

exports.addAllEmployees = async (JSONResponse) => {
  JSONResponse.map(async (object) => {
    let updatedData = object;

    //! Use ListID instead of FullName to allow for changes to the Names
    //todo Make this one database query and just create the customer if findOneAndUpdate returns a cannot find Model Error.
    if (await Employee.findOne({ Name: object.Name })) {
      await Employee.findOneAndUpdate({ Name: object.Name }, updatedData, {
        new: true,
      });
    } else {
      await Employee.create(updatedData);
    }
  });
};
