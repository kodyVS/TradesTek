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
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <!-- Table  -->
    <v-btn-toggle v-model="buttonToggle" color="blue darken-3">
      <v-btn small text @click="getActiveWorkOrders()">Display Active WO's</v-btn>
      <v-btn small text @click="getAllWorkOrders('complete', search)">Display Complete WO's</v-btn>
      <!--<v-btn small text @click="getAllWorkOrders('all')">Display All</v-btn>-->
    </v-btn-toggle>

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :search="search"
      :server-items-length="serverItemsLength"
      :options.sync="options"
      :items-per-page="2"
      :page="page"
      :footer-props="{ 'items-per-page-options': [20, 30, 50, 100] }"
    >
      <template v-slot:top>
        <!-- Top bar -->
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text"> Work Order List</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="newWorkOrder()">New Work Order</v-btn>
        </v-toolbar>
        <v-progress-linear
          color="blue"
          indeterminate
          rounded
          height="4"
          class="header-area"
          v-show="isLoading"
        ></v-progress-linear>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn small class="success ma-1" @click="ViewItem(item)">View</v-btn>
        <v-btn small class="primary ml-1 ma-1" @click="editWorkOrder(item)">Edit</v-btn>
      </template>

      <template v-slot:item.Description="{ item }">
        {{ item.Description | capitalize }}
      </template>

      <template v-slot:item.Complete="{ item }">
        <v-chip v-if="item.IsPending && !item.Complete" color="purple white--text">Pending</v-chip>
        <v-chip v-if="item.Complete" class="success">
          {{ "Completed" }}
        </v-chip>
        <v-chip v-if="!item.IsPending && !item.Complete" color="warning"> Active </v-chip>
      </template>

      <template v-slot:item.Employees="{ item }">
        <v-chip
          v-for="employees in item.Employees"
          :key="employees"
          small
          color="blue darken-4"
          class="ma-1"
          dark
        >
          {{
            employees.split(" ")[0] +
            " " +
            employees
              .split(" ")[1]
              .match(/\b(\w)/g)
              .join("")
              .toUpperCase()
          }}
        </v-chip>
        <!-- <v-btn v-if="item.Employees.length > 3" small>more</v-btn> -->
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      if (value.length > 50) {
        return value.split("").slice(0, 55).join("") + "...";
      }
      return value;
    },
  },
  data: () => ({
    options: {},
    page: 0,
    itemsPerPage: 20,
    isLoading: false,
    completeWO: false,
    serverItemsLength: -1,
    buttonToggle: 0,
    //V-model for searching
    search: "",
    modelArray: [],

    //Fields for the table
    headers: [
      {
        text: "Work Order Name",
        align: "start",
        value: "Name",
      },
      { text: "Customer", value: "Job.ParentRef.FullName" },
      { text: "Job Name", value: "Job.Name" },
      { text: "Description", value: "Description" },
      { text: "PO Number", value: "PONumber" },
      { text: "Employees", value: "Employees", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
      { text: "Job Type", value: "JobType" },
      { text: "Status", value: "Complete" },
    ],

    //Array of objects for table taken from back end
    activeWorkOrders: [],
    items: [],
    filteredItems: [],
    //Values for items that are open on the menu's
    editedIndex: -1,
    editedItem: {},
  }),

  computed: {},
  //When the page is created call the getactiveworkorders method
  watch: {
    search(val) {
      this.getWorkOrdersDebounced(val);
    },
    options() {
      console.log(this.search);
      this.getAllWorkOrders("_", this.search);
    },
  },
  created() {
    this.getActiveWorkOrders();
  },

  methods: {
    //Will get Work Orders from the Db
    async getWorkOrdersDebounced(val) {
      clearTimeout(this._searchTimerId);
      this._searchTimerId = setTimeout(() => {
        this.getAllWorkOrders("_", val);
      }, 1000);
    },
    async getActiveWorkOrders() {
      this.serverItemsLength = -1;
      if (this.activeWorkOrders.length === 0) {
        this.activeWorkOrders = await this.$store.dispatch("getAllActiveWorkOrders");
      }
      this.items = this.activeWorkOrders;
      this.filteredItems = [...this.items];
      this.completeWO = false;
    },

    async getAllWorkOrders(displayVar, val) {
      const { page, itemsPerPage } = this.options;
      this.isLoading = true;
      if (displayVar === "complete" || displayVar === "all") {
        this.completeWO = true;
      }
      let searchParam = {
        Complete: true,
        Page: page,
        ItemsPerPage: itemsPerPage,
      };
      if (val) {
        searchParam.SearchText = val;
        console.log(val);
      }
      try {
        if (this.completeWO) {
          let response = await this.$store.dispatch("getAllWorkOrders", searchParam);
          if (response.metadata) {
            if (response.metadata[0]) {
              this.serverItemsLength = response.metadata[0].total;
            }
          }

          let completedWorkOrderList = response.workOrders;

          this.items = [...completedWorkOrderList];
          this.filteredItems = [...this.items];
        }
      } catch (error) {
        console.log(error);
      }
      //this.filterItems(displayVar);
      this.isLoading = false;
    },
    //Used to route to the individual work orders
    ViewItem(item) {
      this.$router.push("WorkOrders/" + item._id);
    },

    //This will route someone to the create work order page with the workOrder info filled out
    editWorkOrder(item) {
      this.$store.state.item = item;
      this.$store.state.item.Job.Customer = item.Job.ParentRef.FullName;
      this.$router.push("createWO");
    },
    //creates a new WO
    newWorkOrder() {
      this.$router.push("CreateWO");
    },

    //Custom filter for which work orders to display
    // filterItems(displayVar) {
    //   console.log(displayVar);
    //   if (displayVar === "active") {
    //     return (this.filteredItems = this.items.filter((i) => {
    //       return i.Complete === false;
    //     }));
    //   } else if (displayVar === "complete") {
    //     console.log("working");
    //     return (this.filteredItems = this.items.filter((i) => {
    //       return i.Complete === true;
    //     }));
    //   } else if (displayVar === "all") {
    //     return (this.filteredItems = this.items);
    //   }
    // },
  },
};
</script>
