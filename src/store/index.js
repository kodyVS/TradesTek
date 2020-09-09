/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    customerList: [
      {
        "ListID": "8000000C-1597271401",
        "TimeCreated": "2020-08-12T16:30:01-07:00",
        "TimeModified": "2020-08-15T20:06:59-07:00",
        "EditSequence": 1597543619,
        "Name": 15679,
        "FullName": 15679,
        "IsActive": true,
        "Sublevel": 0,
        "CompanyName": "Stone",
        "Salutation": "Mr.",
        "LastName": "Van Sloten",
        "BillAddress": {
          "Addr1": "Stone",
          "Addr2": "Van Sloten"
        },
        "BillAddressBlock": {
          "Addr1": "Stone",
          "Addr2": "Van Sloten"
        },
        "Phone": 7805558474,
        "AdditionalContactRef": {
          "ContactName": "Main Phone",
          "ContactValue": 7805558474
        },
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None"
      },
      {
        "ListID": "80000007-1597259180",
        "TimeCreated": "2020-08-12T13:06:20-07:00",
        "TimeModified": "2020-08-14T11:58:51-07:00",
        "EditSequence": 1597427931,
        "Name": "Joe Customer",
        "FullName": "Joe Customer",
        "IsActive": true,
        "Sublevel": 0,
        "CompanyName": "Joes Garage",
        "Salutation": "Mr",
        "FirstName": "Joe",
        "LastName": "Customer",
        "BillAddress": {
          "Addr1": "105 ave",
          "City": "Edmonton",
          "State": "AB",
          "Country": "Canada"
        },
        "BillAddressBlock": {
          "Addr1": "105 ave",
          "Addr2": "Edmonton, Alberta",
          "Addr3": "Canada"
        },
        "Phone": 7807186528,
        "AdditionalContactRef": {
          "ContactName": "Main Phone",
          "ContactValue": 7807186528
        },
        "Balance": 0,
        "TotalBalance": 577.5,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None"
      },
      {
        "ListID": "80000009-1597259877",
        "TimeCreated": "2020-08-12T13:17:57-07:00",
        "TimeModified": "2020-08-12T13:17:57-07:00",
        "EditSequence": 1597259877,
        "Name": "Joe Customer3",
        "FullName": "Joe Customer3",
        "IsActive": true,
        "Sublevel": 0,
        "CompanyName": "Joes Garage",
        "Salutation": "Mr",
        "FirstName": "Joe",
        "LastName": "Customer3",
        "BillAddress": {
          "Addr1": "123 Main St.",
          "City": "Mountain View",
          "State": "CA",
          "PostalCode": 94566
        },
        "BillAddressBlock": {
          "Addr1": "123 Main St.",
          "Addr2": "Mountain View, CA 94566"
        },
        "Phone": "650-944-1111",
        "AltPhone": "650-944-2111",
        "Email": "joe@joegargage.com",
        "AdditionalContactRef": [
          {
            "ContactName": "Main Phone",
            "ContactValue": "650-944-1111"
          },
          {
            "ContactName": "Alt. Phone",
            "ContactValue": "650-944-2111"
          },
          {
            "ContactName": "Main Email",
            "ContactValue": "joe@joegargage.com"
          }
        ],
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None"
      },
      {
        "ListID": "80000013-1597532055",
        "TimeCreated": "2020-08-15T16:54:15-07:00",
        "TimeModified": "2020-08-15T16:54:15-07:00",
        "EditSequence": 1597532055,
        "Name": "joe garage",
        "FullName": "joe garage",
        "IsActive": true,
        "Sublevel": 0,
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None",
        "BillAddress": {
          "Addr1": "123 fake Street NW",
          "City": "Edmonton"
        }
      },
      {
        "ListID": "80000006-1597256184",
        "TimeCreated": "2020-08-12T12:16:24-07:00",
        "TimeModified": "2020-08-12T16:48:03-07:00",
        "EditSequence": 1597256184,
        "Name": "John 3",
        "FullName": "John 3",
        "IsActive": true,
        "Sublevel": 0,
        "Balance": 472.5,
        "TotalBalance": 472.5,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None",
        "BillAddress": {
          "Addr1": "123 fake Street NW",
          "City": "Edmonton"
        }
      },
      {
        "ListID": "80000003-1597162560",
        "TimeCreated": "2020-08-11T10:16:00-07:00",
        "TimeModified": "2020-08-12T12:15:47-07:00",
        "EditSequence": 1597255978,
        "Name": "John Smiths",
        "FullName": "John Smiths",
        "IsActive": true,
        "Sublevel": 0,
        "CompanyName": "Johns company",
        "Salutation": "mr",
        "FirstName": "John",
        "LastName": "Smith",
        "JobTitle": "contractor",
        "BillAddress": {
          "Addr1": "Johns company",
          "Addr2": "John Smith"
        },
        "BillAddressBlock": {
          "Addr1": "Johns company",
          "Addr2": "John Smith"
        },
        "ShipAddress": {
          "Addr1": "edmonton",
          "Addr2": "edmonton, edmonton EDMONTON",
          "Addr3": "edmonton",
          "City": "edmonton"
        },
        "ShipAddressBlock": {
          "Addr1": "edmonton",
          "Addr2": "edmonton, edmonton EDMONTON",
          "Addr3": "edmonton",
          "Addr4": "edmonton"
        },
        "ShipToAddress": {
          "Name": "Ship To 1",
          "Addr1": "edmonton",
          "Addr2": "edmonton, edmonton EDMONTON",
          "Addr3": "edmonton",
          "City": "edmonton",
          "DefaultShipTo": true
        },
        "Phone": 7805555555,
        "Email": "john@test.com",
        "AdditionalContactRef": [
          {
            "ContactName": "Main Phone",
            "ContactValue": 7805555555
          },
          {
            "ContactName": "Main Email",
            "ContactValue": "john@test.com"
          }
        ],
        "Balance": 682.5,
        "TotalBalance": 682.5,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None"
      },
      {
        "ListID": "80000005-1597255132",
        "TimeCreated": "2020-08-12T11:58:52-07:00",
        "TimeModified": "2020-08-12T12:02:27-07:00",
        "EditSequence": 1597255195,
        "Name": "juan castellon",
        "FullName": "juan castellon",
        "IsActive": true,
        "Sublevel": 0,
        "Salutation": "mr.",
        "FirstName": "juan",
        "LastName": "juan castellon",
        "BillAddress": {
          "Addr1": "juan juan castellon"
        },
        "BillAddressBlock": {
          "Addr1": "juan juan castellon"
        },
        "Balance": 105,
        "TotalBalance": 105,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None"
      },
      {
        "ListID": "80000015-1597685099",
        "TimeCreated": "2020-08-17T11:24:59-07:00",
        "TimeModified": "2020-08-17T11:24:59-07:00",
        "EditSequence": 1597685099,
        "Name": "postman",
        "FullName": "postman",
        "IsActive": true,
        "Sublevel": 0,
        "FirstName": "cool",
        "LastName": "beans",
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None",
        "BillAddress": {
          "Addr1": "123 fake Street NW",
          "City": "Edmonton"
        }
      },
      {
        "ListID": "80000026-1597771800",
        "TimeCreated": "2020-08-18T11:30:00-07:00",
        "TimeModified": "2020-08-18T11:30:00-07:00",
        "EditSequence": 1597771800,
        "Name": "postman4",
        "FullName": "postman4",
        "IsActive": true,
        "Sublevel": 0,
        "FirstName": "cool",
        "LastName": "beans",
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None",
        "BillAddress": {
          "Addr1": "123 fake Street NW",
          "City": "Edmonton"
        }
      },
      {
        "ListID": "80000027-1597777818",
        "TimeCreated": "2020-08-18T13:10:18-07:00",
        "TimeModified": "2020-08-18T13:10:18-07:00",
        "EditSequence": 1597777818,
        "Name": "postman5",
        "FullName": "postman5",
        "IsActive": true,
        "Sublevel": 0,
        "FirstName": "cool",
        "LastName": "beans two",
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None",
        "BillAddress": {
          "Addr1": "123 fake Street NW",
          "City": "Edmonton"
        }
      },
      {
        "ListID": "8000000E-1597273238",
        "TimeCreated": "2020-08-12T17:00:38-07:00",
        "TimeModified": "2020-08-18T13:08:12-07:00",
        "EditSequence": 1597777692,
        "Name": "Stone Industries",
        "FullName": "Stone Industries",
        "IsActive": true,
        "Sublevel": 0,
        "CompanyName": "Stone Industries with an edit",
        "FirstName": "stone",
        "BillAddress": {
          "Addr1": "Stone Industries with an edit"
        },
        "BillAddressBlock": {
          "Addr1": "Stone Industries with an edit"
        },
        "Phone": 55555555,
        "AdditionalContactRef": {
          "ContactName": "Main Phone",
          "ContactValue": 55555555
        },
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None"
      },
      {
        "ListID": "80000014-1597601087",
        "TimeCreated": "2020-08-16T12:04:47-07:00",
        "TimeModified": "2020-08-16T12:04:47-07:00",
        "EditSequence": 1597601087,
        "Name": "test123",
        "FullName": "test123",
        "IsActive": true,
        "Sublevel": 0,
        "CompanyName": "test123",
        "FirstName": "kdsajhfdks",
        "LastName": "fdsak;jfhsa",
        "BillAddress": {
          "Addr1": "tes123",
          "Addr2": "kdsajhfdks fdsak;jfhsa"
        },
        "BillAddressBlock": {
          "Addr1": "tes123",
          "Addr2": "kdsajhfdks fdsak;jfhsa"
        },
        "Balance": 0,
        "TotalBalance": 0,
        "SalesTaxCountry": "Canada",
        "JobStatus": "None",
        "PreferredDeliveryMethod": "None"
      }
    ],
    getters: {
      getCustomerNames: (state) => {
        return state.customerList.FullName;
      },
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
