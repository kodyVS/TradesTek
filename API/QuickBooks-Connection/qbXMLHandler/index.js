//todo find out what util is used for
const util = require("util");

const mongoose = require("mongoose");
const parseString = require("fast-xml-parser");

const JobModel = require("../../models/jobModel");
const CustomerModel = require("../../models/customerModel");
const WorkOrderModel = require("../../models/workOrderModel");
const QBImport = require("./QBImportController");

module.exports = {
  /**
   * Builds an array of qbXML commands
   * to be run by QBWC.
   *
   * @param callback(err, requestArray)
   */

  fetchRequests: async function (callback) {
    try {
      await buildRequests(callback);
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Called when a qbXML response
   * is returned from QBWC.
   *
   * @param response - qbXML response
   */

  handleResponse: async function (response) {
    //Parsing XML into JSON with needed attributes
    let JSONResponse = [];
    JSONResponse = parseString.parse(response, {
      parseTrueNumberOnly: true,
      arrayMode: false,
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    //Setting Variables to send to data success to get the status code and delete name
    let responseQueryName = Object.keys(JSONResponse.QBXML.QBXMLMsgsRs);
    let responseQueryDataName = Object.keys(
      JSONResponse.QBXML.QBXMLMsgsRs[responseQueryName]
    );

    //Update all customers
    if (JSONResponse.QBXML.QBXMLMsgsRs.CustomerQueryRs) {
      QBImport.addAllCustomers(
        JSONResponse.QBXML.QBXMLMsgsRs.CustomerQueryRs.CustomerRet
      );
    }
    //Update all employees
    if (JSONResponse.QBXML.QBXMLMsgsRs.EmployeeQueryRs) {
      QBImport.addAllEmployees(
        JSONResponse.QBXML.QBXMLMsgsRs.EmployeeQueryRs.EmployeeRet
      );
    }

    //Update all Work Orders
    if (JSONResponse.QBXML.QBXMLMsgsRs.InvoiceAddRs) {
      if (JSONResponse.QBXML.QBXMLMsgsRs.InvoiceAddRs.statusCode === "0") {
        JSONResponse.QBXML.QBXMLMsgsRs.InvoiceAddRs.InvoiceRet.Synced = true;
        JSONResponse.QBXML.QBXMLMsgsRs.InvoiceAddRs.InvoiceRet.QBRequest = null;
      }
      QBImport.addWorkOrders(
        JSONResponse.QBXML.QBXMLMsgsRs.InvoiceAddRs.InvoiceRet
      );
    }
    //Log to show all data coming in **Useful**
    //console.log(util.inspect(JSONResponse, { showHidden: false, depth: null }));

    //Adding data success
    //todo I need to refactor this so that is checks if the data is good first before handling the mongodb items.
    //todo And then do the logic in the indvidual handlers when updating
    if (JSONResponse.QBXML.QBXMLMsgsRs[responseQueryName])
      if (
        JSONResponse.QBXML.QBXMLMsgsRs[responseQueryName].statusCode === "0"
      ) {
        console.log("Query Successful");
        //Once the query is successful Remove the QBRequest and make changed synced to true.

        //todo Currently no error handling and currently goes through all jobs and customers on any successful request. **Future version will change to not do this**
        await JobModel.findOneAndUpdate(
          {
            FullName:
              JSONResponse.QBXML.QBXMLMsgsRs[responseQueryName][
                responseQueryDataName[3]
              ].FullName,
          },
          { Synced: true, QBRequest: null },
          { new: true }
        );
        await CustomerModel.findOneAndUpdate(
          {
            FullName:
              JSONResponse.QBXML.QBXMLMsgsRs[responseQueryName][
                responseQueryDataName[3]
              ].FullName,
          },
          { Synced: true, QBRequest: null },
          { new: true }
        );
      }
  },
  /**
   * Called when there is an error
   * returned processing qbXML from QBWC.
   *
   * @param error - qbXML error response
   */
  didReceiveError: function (error) {
    console.log(error);
  },
};

//Function to build requests
async function buildRequests(callback) {
  try {
    //Searches for jobs and customer data that have the value of Synced: false
    let jobData = await JobModel.find({ Synced: false });
    let customerData = await CustomerModel.find({ Synced: false });
    let workOrderData = await WorkOrderModel.find({ Synced: false });
    let updatedData = [];
    let modifiedDate = new Date();
    modifiedDate.setMonth(modifiedDate.getMonth() - 1);
    modifiedDate = modifiedDate.toISOString().substring(0, 10);

    // Pushes found models that have have Synced: false
    //Only pushes the main apps data to QB
    let requests = [];
    if (process.env.TEST === "off") {
      updatedData.push(...customerData);
      updatedData.push(...jobData);
      updatedData.push(...workOrderData);

      // Map through the updated data and creates a request array out of the requests stored on the model
      await updatedData.map((object) => {
        if (object.QBRequest) {
          requests.push(object.QBRequest);
        }
      });
    }

    // Adding a CustomerQuery on every sync to check for updates on quickbooks after our data is synced
    requests.push(
      '<?xml version="1.0" encoding="utf-8"?><?qbxml version="13.0"?><QBXML><QBXMLMsgsRq onError="stopOnError"><CustomerQueryRq></CustomerQueryRq></QBXMLMsgsRq></QBXML>',
      '<?xml version="1.0" encoding="utf-8"?><?qbxml version="13.0"?><QBXML><QBXMLMsgsRq onError="stopOnError"><EmployeeQueryRq></EmployeeQueryRq></QBXMLMsgsRq></QBXML>'
    );
    //   `<?xml version="1.0" encoding="utf-8"?><?qbxml version="13.0"?><QBXML><QBXMLMsgsRq onError="stopOnError"><InvoiceQueryRq><ModifiedDateRangeFilter><FromModifiedDate>${modifiedDate}</FromModifiedDate></ModifiedDateRangeFilter><IncludeLineItems>true</IncludeLineItems></InvoiceQueryRq></QBXMLMsgsRq></QBXML>`
    //Currently logging the requests to console
    console.log(requests);

    return await callback(null, requests);
  } catch (err) {
    console.log(err);
  }
}
