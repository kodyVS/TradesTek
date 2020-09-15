<template>
  <div>
    <!-- Search function for the table -->
    <v-container mb-4>
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Work Orders"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <!-- Table  -->
    <v-data-table :headers="headers" :items="items" :search="search">
      <template v-slot:top>
        <!-- Top bar -->
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text">
            Work Order List</v-toolbar-title
          >
          <v-spacer></v-spacer>

          <v-btn color="primary" v-on="on" @click="newJob()"
            >New Work Order</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn small class="success" @click="ViewItem(item)">View</v-btn>
        <v-btn small class="primary ml-2" @click="createWO(item)">Edit</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    //V-model for searching
    search: "",

    //Fields for the table
    headers: [
      {
        text: "Work Order Name",
        align: "start",
        value: "Name",
      },
      { text: "Customer", value: "ParentRef.FullName" },
      { text: "PO Number", value: "" },
      { text: "Employees", value: "", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
      { text: "type", value: "" },
      { text: "Status", value: "" },
    ],

    //Array of objects for table taken from back end
    items: [],

    //Values for items that are open on the menu's
    editedIndex: -1,
    editedItem: {},
  }),

  computed: {},

  watch: {
    //Watching if the dialog is open and when it closes. If it closes set readOnly back to true
  },

  //When the page is created call the getJob method
  created() {
    this.getJobs();
  },
  methods: {
    //Will get Job from the Db and console log an error if there is an error
    async getJobs() {
      this.items = await this.$store.dispatch("getJobs");
    },
    //Used to view a pop up
    ViewItem(item) {
      this.$router.push("WorkOrders/" + item._id);
    },

    //This will route someone to the create work order page with the Job field filled out
    createWO(item) {
      this.$store.state.itemInfo = item;
    },
    newJob() {
      this.$router.push("CreateWO");
    },
    async createJob(item) {
      console.log(item);
    },
  },
};
</script>
