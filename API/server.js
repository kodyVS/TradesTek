//! remove mongo-memory-server

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const dotenv = require("dotenv").config();
const express = require("express");
const workOrderRoutes = require("./Routes/workOrderRoutes");
const timeRoutes = require("./Routes/timeRoutes");
const settingsRoutes = require("./Routes/settingsRoutes");
const customerRoutes = require("./Routes/customerRoutes");
const jobRoutes = require("./Routes/jobRoutes");
const employeeRoutes = require("./Routes/employeeRoutes");
const userRoutes = require("./Routes/userRoutes");
const testRoutes = require("./Routes/testRoutes");
const AppError = require("./Utils/appError.js");
const globalErrorHandler = require("./controllers/errorController");
const app = express();
const cors = require("cors");
//Error catching on uncaughtException
// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

//cors
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.options("*", cors());
//Parse body into json format
app.use(express.json());

//routes
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/workOrder", workOrderRoutes);
app.use("/api/v1/time", timeRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

//starting SOAP Server
var Server = require("quickbooks-js");
var qbXMLHandler = require("./Quickbooks-Connection/qbXMLHandler");
var soapServer = new Server();
soapServer.setQBXMLHandler(qbXMLHandler);
soapServer.run();

//Setting up MongoDb server with mongoose
if (process.env.TEST === "off") {
  const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connection successful!"));
} else if (process.env.TEST === "on") {
  const DB = process.env.TEST_DATABASE.replace(
    "<PASSWORD>",
    process.env.TEST_DATABASE_PASSWORD
  );
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Test DB connection successful!"));
}

// Starting server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
module.exports = server;

// Logging errors and temrinating program
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log(" Process terminated!");
  });
});
