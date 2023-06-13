require('dotenv').config();
var Server = require('quickbooks-js');  
var qbXMLHandler = require('./qbXMLHandler');
var soapServer = new Server();
soapServer.setQBXMLHandler(qbXMLHandler);
soapServer.run();