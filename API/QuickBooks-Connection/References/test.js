var data2xml = require("data2xml");
var convert = data2xml({
  xmlHeader:
    '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n',
});

let hello = convert("QBXML", {
  QBXMLMsgsRq: {
    _attr: { onError: "stopOnError" },
    CustomerAddRq: {
      CustomerAdd: {
        Name: "New Customer",
        IsActive: 1,
        CompanyName: "Joes Garage",
        Salutation: "Mr",
        FirstName: "Joe",
        LastName: "Customer4",
        BillAddress: {
          Addr1: "123 Main St.",
          City: "Mountain View",
          State: "CA",
          PostalCode: "94566",
        },

        Phone: "650-944-1111",
        AltPhone: "650-944-2111",
        Email: "joe@joegargage.com",
      },
    },
  },
});

let goodbye = convert("QBXML", {
  InvoiceQueryRq: {},
});

console.log(hello);
console.log(goodbye);
