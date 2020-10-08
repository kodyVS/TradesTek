<template>
  <div>
    <v-snackbar v-model="createdAlert" color="" class="success--text" top
      ><template v-slot:action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="createdAlert = false"> Close </v-btn>
      </template>
      <v-icon color="green">mdi-check</v-icon>
      <span> Customer has been successfully created </span>
    </v-snackbar>
    <!-- Search function for the table -->
    <v-container mb-4>
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Customers"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <!-- Table  -->
    <v-data-table
      dense
      :headers="headers"
      :items="items"
      :search="search"
      :items-per-page="20"
      :footer-props="{ 'items-per-page-options': [20, 30, 50, 100] }"
    >
      <template v-slot:top>
        <!-- Top bar -->
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text">Customer List</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Details and edit dialog up menu -->
          <v-dialog v-model="dialog" max-width="90%" :persistent="!readOnly">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" v-on="on" @click.native="newCustomer()">New Customer</v-btn>
            </template>
            <v-card class color="grey lighten-3">
              <v-card-title
                :class="
                  readOnly ? 'pt-3 pl-3 secondary white--text' : 'pt-3 pl-3 warning white--text'
                "
                >{{ editedItem.FullName }}</v-card-title
              >
              <v-form ref="form" class="mt-8">
                <v-container>
                  <v-row>
                    <!-- Full Name for Customer Name -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="editedItem.FullName"
                        class="grey--text"
                        label="Customer Name"
                        outlined
                        :readonly="newCustomerBoolean"
                        dense
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>

                    <!-- Name of Contact -->
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="editedItem.FirstName"
                        :clearable="!readOnly"
                        label="First Name"
                        outlined
                        :readonly="readOnly"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="editedItem.LastName"
                        :clearable="!readOnly"
                        label="Last Name"
                        outlined
                        :readonly="readOnly"
                        dense
                      ></v-text-field>
                    </v-col>

                    <!-- Phone Number -->
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="editedItem.Phone"
                        label="Phone Number"
                        outlined
                        :clearable="!readOnly"
                        dense
                        :readonly="readOnly"
                      ></v-text-field>
                    </v-col>

                    <!-- Email -->
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="editedItem.Email"
                        label="Email"
                        outlined
                        :clearable="!readOnly"
                        dense
                        :readonly="readOnly"
                      ></v-text-field>
                    </v-col>

                    <!-- Billing Address -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="editedItem.BillAddress.Addr1"
                        label="Address"
                        outlined
                        :clearable="!readOnly"
                        dense
                        :readonly="readOnly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="2">
                      <v-text-field
                        v-model="editedItem.BillAddress.City"
                        label="city"
                        outlined
                        :clearable="!readOnly"
                        dense
                        :readonly="readOnly"
                      ></v-text-field>
                    </v-col>
                    <!-- Postal Code -->
                    <v-col cols="6" md="2">
                      <v-text-field
                        v-model="editedItem.BillAddress.PostalCode"
                        label="Postal Code"
                        outlined
                        dense
                        :readonly="readOnly"
                        :clearable="!readOnly"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Buttons for create WO and edit customer and save changes on dialog-->
                  <v-layout align-end justify-end>
                    <v-btn v-if="readOnly" color="primary" @click="createJob(editedItem)"
                      >Create Job</v-btn
                    >
                    <v-btn v-if="readOnly" color="warning" @click="readOnly = !readOnly"
                      >Edit Customer</v-btn
                    >
                  </v-layout>

                  <v-btn
                    v-if="!readOnly && newCustomerBoolean"
                    large
                    color="success"
                    @click="editCustomer(editedItem)"
                    >Save Changes</v-btn
                  >

                  <v-btn
                    v-show="newCustomerBoolean === false"
                    class="mr-2"
                    large
                    color="success"
                    @click="createCustomer(editedItem)"
                    >Create new customer</v-btn
                  >
                  <v-btn
                    v-if="!readOnly"
                    large
                    color="primary"
                    @click="
                      dialog = !dialog;
                      readOnly = !readOnly;
                    "
                    >cancel</v-btn
                  >
                  <!--Loading circle during Requests -->
                  <v-progress-circular
                    v-if="isLoading"
                    indeterminate
                    color="primary"
                    class="ml-4"
                  ></v-progress-circular>
                </v-container>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- Buttons for Details and Create WO on table -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <template v-slot:item.actions="{ item }">
        <v-btn small class="success" @click="ViewItem(item)">Details</v-btn>
        <v-btn small class="primary ml-2" @click="createJob(item)">Create Job</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    //Truth for if the dialog is
    newCustomerBoolean: true,
    dialog: false,
    isLoading: false,

    //rules
    nameRules: [(v) => !!v || "Name is required"],
    //Truth for if editting is turned on
    readOnly: true,

    //V-model for searching
    search: "",

    //Fields for the table
    headers: [
      {
        text: "Company Name",
        align: "start",
        value: "FullName",
      },
      { text: "Phone", value: "Phone", sortable: false },
      { text: "Email", value: "Email", sortable: false },

      { text: "Actions", value: "actions", sortable: false },
    ],

    //Array of objects for table taken from back end
    items: [],

    //Values for items that are open on the menu's
    createdAlert: false,
    editedIndex: -1,
    editedItem: {
      ListID: "",
      EditSequence: "",
      Name: "",
      CompanyName: "",
      FirstName: "",
      LastName: "",
      BillAddress: {
        Addr1: "",
        City: "",
        PostalCode: "",
      },
      Phone: "",
      Email: "",
    },
  }),

  computed: {},

  watch: {
    //Watching if the dialog is open and when it closes. If it closes set readOnly back to true
    dialog() {
      this.readOnly = true;
      this.newCustomerBoolean = true;
    },
  },

  //When the page is created call the getCustomer method
  created() {
    this.getCustomers();
  },
  methods: {
    //Clear the edit fields when this is called
    clearEdit() {
      this.editedItem = {
        ListID: "",
        EditSequence: "",
        Name: "",
        CompanyName: "",
        FirstName: "",
        LastName: "",
        BillAddress: {
          Addr1: "",
          City: "",
          PostalCode: "",
        },
        Phone: "",
        Email: "",
      };
    },

    //Will get customer from the Db and console log an error if there is an error
    async getCustomers() {
      this.items = await this.$store.dispatch("getCustomers");
    },
    //Used to view a pop up
    ViewItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    //save changes to a customer to the database
    //todo Move Into Store
    async editCustomer(item) {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/customer/edit", {
            ListID: item.ListID,
            EditSequence: item.EditSequence,
            Name: item.Name,
            FullName: item.FullName,
            CompanyName: item.CompanyName,
            FirstName: item.FirstName,
            LastName: item.LastName,
            BillAddress: item.BillAddress,
            Phone: item.Phone,
            Email: item.Email,
          })
          .then(async () => {
            await this.getCustomers();
            this.isLoading = false;
            this.readOnly = !this.readOnly;
          })
          .catch((error) => {
            if (error.response) {
              alert(error.response.data.message);
            } else {
              alert("Something went wrong! Check Network Connection");
            }
            this.isLoading = false;
          });
      }
    },

    //This will route someone to the create work order page with the customer field filled out
    createJob(item) {
      this.$store.state.newJobData = item;
      this.$router.push("Jobs");
    },
    newCustomer() {
      this.readOnly = false;
      this.newCustomerBoolean = false;
      this.clearEdit();
    },
    //todo Move into Store
    async createCustomer(item) {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        //due to quickbooks formatting Name and FullName have to be the same
        await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/customer/add", {
            Name: item.FullName,
            FullName: item.FullName,
            CompanyName: item.CompanyName,
            FirstName: item.FirstName,
            LastName: item.LastName,
            BillAddress: item.BillAddress,
            Phone: item.Phone,
            Email: item.Email,
          })
          .then(async () => {
            await this.getCustomers();
            this.readOnly = !this.readOnly;
            this.createdAlert = true;
            this.newCustomerBoolean = true;
            this.isLoading = false;
          })
          .catch((error) => {
            if (error.response) {
              alert(error.response.data.message);
            } else {
              alert("Something went wrong! Check Network Connection");
            }
            this.isLoading = false;
          });
      }
    },
  },
};
</script>
