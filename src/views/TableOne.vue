
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
      :headers="headers"
      :items="items"
      sort-by="calories"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <!-- Top bar -->
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text">Customer List</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Details and edit dialog up menu -->
          <v-dialog v-model="dialog" max-width="90%" :persistent="!readOnly">
            <template v-slot:activator="{ on, }">
              <v-btn color="primary" v-on="on" v-on:click.native="newCustomer()">New Customer</v-btn>
            </template>
            <v-card class color="grey lighten-3">
              <v-card-title
                :class="
                  readOnly
                    ? 'pt-3 pl-3 secondary white--text'
                    : 'pt-3 pl-3 warning white--text'"
              >{{ editedItem.FullName }}</v-card-title>
              <v-form class="mt-8" ref="form">
                <v-container>
                  <v-row>
                    <!-- Full Name for Customer Name -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="grey--text"
                        v-model="editedItem.FullName"
                        label="Customer Name"
                        outlined
                        :readonly="fullName"
                        dense
                        :rules="fullNameRules"
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
                        :value="
                          editedItem.BillAddress
                            ? editedItem.BillAddress.Addr1
                            : ''
                        "
                        label="Address"
                        outlined
                        :clearable="!readOnly"
                        dense
                        :readonly="readOnly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="2">
                      <v-text-field
                        :value="
                          `${
                            editedItem.BillAddress
                              ? editedItem.BillAddress.City
                              : ''
                          }`
                        "
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
                        :value="
                          editedItem.BillAddress
                            ? `${
                                editedItem.BillAddress.PostalCode
                                  ? editedItem.BillAddress.PostalCode
                                  : ''
                              }`
                            : ''
                        "
                        label="Postal Code"
                        outlined
                        dense
                        :readonly="readOnly"
                        :clearable="!readOnly"
                      ></v-text-field>
                    </v-col>

                    <!-- PO Number -->
                    <v-col cols="12" md="2">
                      <v-text-field value="17921" label="PO Number" outlined dense :readonly="true"></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Buttons for create WO and edit customer and save changes on dialog-->
                  <v-layout align-end justify-end>
                    <v-btn v-if="readOnly" color="primary" @click="createWO(editedItem)">Create WO</v-btn>
                    <v-btn
                      color="warning"
                      v-if="readOnly"
                      @click="readOnly = !readOnly"
                    >Edit Customer</v-btn>
                  </v-layout>
                  <v-btn
                    large
                    color="success"
                    v-if="!readOnly && fullName"
                    @click="
                      dialog = !dialog;
                      readOnly = !readOnly;
                      saveItem(editedItem);"
                  >Save Changes</v-btn>
                  <v-btn
                    class="mr-2"
                    large
                    color="success"
                    v-if="!fullName"
                    @click="
                      createCustomer(editedItem);"
                  >Create new customer</v-btn>
                  <v-btn
                    large
                    color="primary"
                    v-if="!readOnly"
                    @click="
                      dialog = !dialog;
                      readOnly = !readOnly;"
                  >cancel</v-btn>
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
        <v-btn small class="primary ml-2" @click="
        createWO(item)">Create WO</v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary">Resest</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    //Truth for if the dialog is open
    fullName: true,
    dialog: false,
    

    //rules
    fullNameRules: [
      v => !!v || 'Name is required',
    ],
    //Truth for if editting is turned on
    readOnly: true,
    
    //V-model for searching
    search: "",
    
    //Fields for the table
    headers: [
      {
        text: "Company Name",
        align: "start",
        value: "FullName"
      },
      { text: "Email", value: "Email", sortable: false },
      { text: "Phone", value: "Phone", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    
    //Array of objects for table taken from back end
    items: [],

    //Values for items that are open on the menu's
    editedIndex: -1,
    editedItem: {},
  }),

  computed: {
  },

  watch: {
    //Watching if the dialog is open and when it closes. If it closes set readOnly back to true
    //Not sure what the val val is
    dialog() {
      this.readOnly = true; 
      this.fullName = true;
    }
  },

//When the page is created call the getCustomer method
  created() {
    this.getCustomers();
  },
  methods: {
    //Will get customer from the Db and console log an error if there is an error
    async getCustomers() {
      console.log("getting customers");
      await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/customer/all")
        .then(response => {
          this.items = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //Used to view a pop up
    ViewItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    //save changes to a customer to the database
    async saveItem(item) {
      const res = await axios.post(
        process.env.VUE_APP_API_URL + "/api/v1/customer/edit",
        {
          ListID: item.ListID,
          EditSequence: item.EditSequence,
          Name: item.Name,
          FullName: item.FullName,
          CompanyName: item.CompanyName,
          FirstName: item.FirstName,
          LastName: item.LastName,
          Phone: item.Phone,
          Email: item.Email
        }
      ).then(this.getCustomers()).catch(err => console.log(err, res))
    },
    
    //This will route someone to the create work order page with the customer field filled out
  createWO(item) {
    this.$store.state.itemInfo = item
    this.$router.push('CreateWO');
    console.log(this.$store.state.itemInfo)
  },
  newCustomer() {
    this.readOnly= !this.readOnly;
    this.fullName = false;
    this.editedItem = []
  },
  async createCustomer(item) {
    if(this.$refs.form.validate()){
    this.dialog = !this.dialog;
    this.readOnly = !this.readOnly;
    const res = await axios.post(
        process.env.VUE_APP_API_URL + "/api/v1/customer/add",
        {
          Name: item.FullName,
          FullName: item.FullName,
          CompanyName: item.CompanyName,
          FirstName: item.FirstName,
          LastName: item.LastName,
          Phone: item.Phone,
          Email: item.Email,
          Synced: false,
        }
      ).then(response => {
        this.getCustomers()
        console.log(response)
      }).catch(err => console.log(err, res))
    }

  }
  }
};
</script>
