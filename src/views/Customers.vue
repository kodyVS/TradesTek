<template>
  <div>
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

          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-btn text color="white" v-on="on">
                <span>Options</span>
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-switch
                  v-model="showHidden"
                  @change="showHiddenCustomers()"
                  label="Show Only Deleted Customers?"
                ></v-switch>
              </v-list-item>
            </v-list>
          </v-menu>

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
              >
                <span>{{ editedItem.FullName }}</span>
                <v-spacer></v-spacer>
                <v-icon v-if="!readOnly" large @click="deleteCustomer(editedItem._id)" color="white"
                  >mdi-delete</v-icon
                ></v-card-title
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
                    <v-btn
                      v-if="readOnly && !showHidden"
                      color="primary"
                      @click="createJob(editedItem)"
                      >Create Job</v-btn
                    >
                    <v-btn v-if="showHidden" @click="editCustomer(editedItem, true)">
                      Restore Customer
                    </v-btn>
                    <v-btn
                      v-if="readOnly && !showHidden"
                      color="warning"
                      @click="readOnly = !readOnly"
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
        <v-btn small class="primary ml-2" v-if="!showHidden" @click="createJob(item)"
          >Create Job</v-btn
        >
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
    showHidden: false,

    //Truth for if editting is turned on
    readOnly: true,

    //rules
    nameRules: [(v) => !!v || "Name is required"],

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
      let customers = await this.$store.dispatch("getCustomers", this.showHidden);
      this.items = customers;
    },

    //Used to view a pop up
    ViewItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    //save changes to a customer to the database
    //todo Move Into Store
    async editCustomer(item, restore) {
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
          let editedCustomer = {
            _id: item._id,
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
          };

          if (restore === true) {
            editedCustomer.Hidden = false;
          }

          await axios.post(process.env.VUE_APP_API_URL + "/api/v1/customer/edit", editedCustomer, {
            withCredentials: true,
          });
          await this.getCustomers();
          this.isLoading = false;
          this.readOnly = !this.readOnly;
          let payload = { type: "success", message: "Successfully edited Customer" };
          this.$store.dispatch("snackBarAlert", payload);
        } catch (error) {
          let payload = { type: "error" };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          this.$store.dispatch("snackBarAlert", payload);
          this.isLoading = false;
        }
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
        try {
          await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/customer/add",
            {
              Name: item.FullName,
              FullName: item.FullName,
              CompanyName: item.CompanyName,
              FirstName: item.FirstName,
              LastName: item.LastName,
              BillAddress: item.BillAddress,
              Phone: item.Phone,
              Email: item.Email,
            },
            { withCredentials: true }
          );
          await this.getCustomers();
          this.readOnly = !this.readOnly;
          let payload = { type: "success", message: "Successfully created Customer" };
          this.$store.dispatch("snackBarAlert", payload);
          this.newCustomerBoolean = true;
          this.isLoading = false;
        } catch (error) {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          this.$store.dispatch("snackBarAlert", payload);
          this.isLoading = false;
        }
      }
    },
    async deleteCustomer(selectedCustomer) {
      let res = await this.$confirm("Are you sure you would like to delete this customer?", {
        color: "warning",
        title: "Are you sure?",
      });
      if (res) {
        await axios.post(
          process.env.VUE_APP_API_URL + "/api/v1/customer/delete",
          {
            _id: selectedCustomer,
          },
          { withCredentials: true }
        );
        this.readOnly = !this.readOnly;
        this.dialog = !this.dialog;
        this.getCustomers();
      }
    },
    showHiddenCustomers() {
      this.getCustomers();
    },
  },
};
</script>
