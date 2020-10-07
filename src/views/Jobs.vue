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
            label="Search Jobs"
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
      :search="search"
      :items-per-page="20"
      :footer-props="{ 'items-per-page-options': [20, 30, 50, 100] }"
    >
      <template v-slot:top>
        <!-- Top bar -->
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text">Job Site List</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Details and edit dialog up menu -->
          <v-dialog v-model="dialog" max-width="90%" :persistent="!readOnly">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" v-on="on" @click.native="newJob()">New Job Site</v-btn>
            </template>
            <v-card class color="grey lighten-3">
              <v-card-title
                :class="
                  readOnly ? 'pt-3 pl-3 secondary white--text' : 'pt-3 pl-3 warning white--text'
                "
                >{{ editedItem.Name }}</v-card-title
              >
              <v-form ref="form" class="mt-8">
                <v-container>
                  <v-row>
                    <!-- Full Name for Job Name -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="editedItem.Name"
                        class="grey--text"
                        dense
                        label="Job Site Name"
                        outlined
                        :readonly="!newJobBoolean"
                        :disabled="!newJobBoolean && !readOnly"
                        :rules="fullNameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-model="editedItem.Customer"
                        :items="customerList"
                        dense
                        outlined
                        label="Customer"
                        :readonly="!newJobBoolean"
                        :disabled="!newJobBoolean && !readOnly"
                        :clearable="newJobBoolean"
                        :rules="fullNameRules"
                      ></v-autocomplete>
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
                  <!-- Buttons for create WO and edit job and save changes on dialog-->
                  <v-layout align-end justify-end>
                    <v-btn v-if="readOnly" color="primary" @click="createWO(editedItem)"
                      >Create WO</v-btn
                    >
                    <v-btn v-if="readOnly" color="warning" @click="readOnly = !readOnly"
                      >Edit Job</v-btn
                    >
                  </v-layout>
                  <v-btn
                    v-if="!readOnly && !newJobBoolean"
                    large
                    color="success"
                    @click="
                      dialog = !dialog;
                      readOnly = !readOnly;
                      saveItem(editedItem);
                    "
                    >Save Changes</v-btn
                  >
                  <v-btn
                    v-if="newJobBoolean"
                    class="mr-2"
                    large
                    color="success"
                    @click="createJob(editedItem)"
                    >Create new job</v-btn
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
        <v-btn small class="primary ml-2" @click="createWO(item)">Create WO</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    //Truth for if the dialog is open
    newJobBoolean: true,
    dialog: false,
    createdAlert: false,

    //rules
    fullNameRules: [(v) => !!v || "required"],
    //Truth for if editting is turned on
    readOnly: true,

    //V-model for searching
    search: "",

    //Fields for the table
    headers: [
      {
        text: "Job Name",
        align: "start",
        value: "Name",
      },
      {
        text: "Customer",
        value: "Customer",
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

    customerList: [],
  }),

  computed: {},

  watch: {
    //Watching if the dialog is open and when it closes. If it closes set readOnly back to true
    dialog() {
      if (this.dialog === false) {
        this.readOnly = true;
        this.newJobBoolean = true;
      }
    },
  },
  //When the page is created call the getJob method
  created() {
    this.getJobs();
    this.populateJob();
    this.getCustomers();
  },
  methods: {
    async populateJob() {
      this.newJobData = await JSON.parse(JSON.stringify(this.$store.getters.getNewJobData));
      if (this.$store.state.newJobData.FullName) {
        this.dialog = true;
        this.newJobBoolean = true;
        this.readOnly = !this.readOnly;
        this.editedItem = this.$store.state.newJobData;
        this.editedItem.Customer = this.editedItem.FullName;
        this.editedItem.Name = "";
        this.editedItem.BillAddress = {
          Addr1: "",
          City: "",
          PostalCode: "",
        };
        this.$store.state.newJobData = {};
      }
    },
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

    //Will get job from the Db and console log an error if there is an error
    async getJobs() {
      this.items = await this.$store.dispatch("getJobs");
      this.items.map((item) => {
        if (!item.BillAddress) {
          item.BillAddress = {
            Addr1: "",
            City: "",
            PostalCode: "",
          };
        }
        item.Customer = item.ParentRef.FullName;
      });
    },
    //Used to view a pop up
    ViewItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.readOnly = true;
      this.newJobBoolean = false;
    },

    async getCustomers() {
      this.customerList = await this.$store.dispatch("getCustomers");
      this.customerList = this.customerList.map((customer) => {
        return customer.FullName;
      });
    },

    //save changes to a job to the database
    async saveItem(item) {
      const res = await axios
        .post(process.env.VUE_APP_API_URL + "/api/v1/job/edit", {
          ListID: item.ListID,
          FullName: item.FullName,
          EditSequence: item.EditSequence,
          Name: item.Name,
          ParentRef: item.ParentRef,
          FirstName: item.FirstName,
          LastName: item.LastName,
          BillAddress: item.BillAddress,
          Phone: item.Phone,
          Email: item.Email,
          Synced: false,
        })
        .then(async (response) => {
          await this.getJobs();
          console.log(response.data.data.data);
        })
        .catch((err) => console.log(err, res));
    },

    //This will route someone to the create work order page with the job field filled out
    createWO(item) {
      this.$store.state.itemInfo = item;
      this.$router.push("CreateWO");
      console.log(this.$store.state.itemInfo);
    },
    newJob() {
      this.readOnly = !this.readOnly;
      this.newJobBoolean = true;
      this.clearEdit();
    },
    async createJob(item) {
      if (this.$refs.form.validate()) {
        item.FullName = `${item.Customer}:${item.Name}`;
        item.ParentRef = {
          FullName: item.Customer,
        };
        const res = await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/job/add", {
            Name: item.Name,
            FullName: item.FullName,
            ParentRef: item.ParentRef,
            CompanyName: item.CompanyName,
            FirstName: item.FirstName,
            LastName: item.LastName,
            BillAddress: item.BillAddress,
            Phone: item.Phone,
            Email: item.Email,
            Synced: false,
          })
          .then(async () => {
            await this.getJobs();
            this.createdAlert = true;
            this.readOnly = !this.readOnly;
            this.newJobBoolean = false;
          })
          .catch((err) => console.log(err, res));
      }
    },
  },
};
</script>
