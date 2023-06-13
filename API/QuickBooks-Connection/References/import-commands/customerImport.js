//This was only used once, no longer required but keeping for a reference

const data2xml = require("data2xml");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const QbxmlRq = require("../../../models/QbxmlModel");
const convert = data2xml({
  xmlHeader:
    '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n',
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

let QBXMLCostumerRq = convert("QBXML", {
  QBXMLMsgsRq: {
    _attr: { onError: "stopOnError" },
    EmployeeQueryRq: {},
  },
});
let QBXMLCostumerRq2 = { Qbxml: QBXMLCostumerRq };
const importCustomers = async () => {
  try {
    await QbxmlRq.create(QBXMLCostumerRq2);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

importCustomers();
