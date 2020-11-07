<script>
//todo Pretty up this page a lot
//todo add pictures to be displayed
</script>
<template>
  <div>
    <v-container class="mt-4">
      <v-flex xs12>
        <v-card hover shaped>
          <v-btn v-if="!selectedWO" class="ml-4" @click="$router.go(-1)">Back to Overview</v-btn>
          <v-card-title>
            <h3>{{ workOrder.Name }}</h3>
            <v-card-subtitle class="text-center black--text ml-n3"
              ><i> - {{ workOrder.Complete ? "Completed" : "Active" }}</i></v-card-subtitle
            >
          </v-card-title>
          <v-card-text class="black--text mt-n5 ml-4">{{ workOrder.Description }}</v-card-text>
          <v-card-text>
            <h4>PO Number</h4>
            <h4 class="black--text ml-2">
              {{ workOrder.PONumber }}
            </h4>
            <h4>Customer</h4>
            <h4 class="black--text ml-2">
              {{ workOrder.Job.ParentRef.FullName }}
            </h4>

            <h4>Contact Name</h4>
            <h4 class="black--text ml-2">
              {{ `${workOrder.Job.FirstName + " " + workOrder.Job.LastName}` }}
            </h4>
            <h4>Email</h4>
            <h4 class="black--text ml-2">{{ workOrder.Job.Email }}</h4>

            <h4>Phone</h4>
            <h4 class="black--text ml-2">{{ workOrder.Job.Phone }}</h4>
            <h4>Address</h4>
            <h4>
              <a :href="`https://www.google.com/maps/search/?api=1&query=${getAddressString}`">{{
                getAddressString
              }}</a>
            </h4>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" v-if="$store.state.userRole === 'admin'" @click="editWorkOrder()"
              >Edit</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-bookmark</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 class="mt-4" v-if="$store.state.userRole === 'admin'">
        <v-card hover>
          <v-card-title>
            <h3>Statistics</h3>
          </v-card-title>
          <v-card-subtitle></v-card-subtitle>
          <v-card-text>
            <h3>Total Time on Site: {{ hoursWorked }} Hrs</h3>
            <h3>Time spent per employee:</h3>
            <h3></h3>
            <h3></h3>
            <h3></h3>
            <p></p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-bookmark</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card class="mt-4 text-center">
          <v-card-title class="justify-center">
            <v-btn large color="success darken-1" @click="showTimeBreakdown(false)">
              <span> Show Time History </span>
              <v-icon>{{ showComments ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text
            v-if="showComments && dailyCommentsFiltered.length < 1"
            class="black--text"
            v-text="'No Time Data!'"
          ></v-card-text>
          <v-expand-transition>
            <v-card-text v-if="showComments && dailyCommentsFiltered.length > 0">
              <v-container mb-4>
                <v-row justify="center">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Search Time"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>

              <!-- Table  -->
              <v-data-table
                :headers="headers"
                fixed-header
                dense
                :search="search"
                :items="dailyCommentsFiltered"
                :items-per-page="20"
                :footer-props="{ 'items-per-page-options': [20, 30, 50, 100] }"
                class="elevation-1"
              >
              </v-data-table>
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-flex>
    </v-container>
  </div>
</template>
<script>
export default {
  props: ["selectedWO"],
  data() {
    return {
      showComments: false,
      timePopulated: false,
      dailyComments: [],
      dailyCommentsFiltered: [],
      workOrder: {
        Name: "",
        Job: {
          FirstName: "",
          LastName: "",
          Phone: "",
          Email: "",
          ParentRef: {
            FullName: "",
            ListID: "",
          },
          BillAddress: {
            Addr1: " ",
            City: " ",
            PostalCode: "",
          },
        },
        JobType: "",
        Employees: [],
        Description: "",
        ListID: "",
        EditSequence: "",
        Complete: "",
        Whatever: "",
        TimeReference: [],
      },
      search: "",

      //Fields for the table
      headers: [
        {
          text: "Date",
          align: "start",
          value: "Date",
          width: "150",
        },
        {
          text: "Time In",
          value: "TimeIn",
          width: "120",
        },
        { text: "Time Out", value: "TimeOut", sortable: false, width: "120" },
        { text: "Time (minutes)", value: "Minutes", sortable: false, width: "120" },
        { text: "Employee", value: "Employee", width: "160" },
        { text: "Description", value: "Desc" },
      ],
    };
  },
  computed: {
    //calcuates the hours worked with adding EPSILON to fix some of javascripts rounding issues
    hoursWorked: function () {
      let totalTime = 0;
      this.workOrder.TimeReference.map((timeStamp) => {
        totalTime = timeStamp.Quantity + totalTime;
      });
      totalTime = Math.round((totalTime / 60 + Number.EPSILON) * 100) / 100;
      return totalTime;
    },
    //Creates the address string
    getAddressString: function () {
      return `${this.workOrder.Job.BillAddress.Addr1 ? this.workOrder.Job.BillAddress.Addr1 : ""} ${
        this.workOrder.Job.BillAddress.City ? this.workOrder.Job.BillAddress.City : ""
      } ${
        this.workOrder.Job.BillAddress.PostalCode ? this.workOrder.Job.BillAddress.PostalCode : ""
      }`;
    },
  },
  //at create call getWorkOrders
  created() {
    this.getWorkOrder();
  },
  methods: {
    //Call get work order from the database
    async getWorkOrder() {
      if (!this.selectedWO) {
        this.workOrder = await this.$store.dispatch("getWorkOrder", [this.$route.params.id]);
      } else {
        this.workOrder = this.selectedWO;
      }
    },

    //send work order to the edit/create work order function
    editWorkOrder() {
      this.$store.state.item = this.workOrder;
      this.$router.replace({ name: "CreateWO" });
    },

    //Shows the breakdown of the times

    async showTimeBreakdown() {
      if (this.timePopulated === true) {
        this.showComments = !this.showComments;
      }
      if (this.timePopulated === false) {
        await this.$store.dispatch("getWorkOrder", [this.workOrder._id, true]).then((workOrder) => {
          this.showComments = !this.showComments;
          this.timePopulated = true;
          this.workOrder = workOrder;
          if (this.dailyComments.length < 1) {
            workOrder.TimeReference.sort(function (a, b) {
              return a.TimeData[0] > b.TimeData[1] ? -1 : a.date > b.date ? 1 : 0;
            });
            //Sorted Time Data to show new times first
            workOrder.TimeReference.map((timeStamp) => {
              let structuredDate = new Date(timeStamp.TimeData[0]).toString().substr(0, 15);
              let structuredTimeIn = timeStamp.TimeData[0].substr(11, 8);
              let structuredTimeOut = timeStamp.TimeData[1].substr(11, 8);
              let data = {
                Date: structuredDate,
                TimeIn: structuredTimeIn,
                TimeOut: structuredTimeOut,
                Employee: timeStamp.EmployeeReference.Name,
                Minutes: timeStamp.Quantity,
              };
              if (timeStamp.Desc) {
                data.Desc = timeStamp.Desc;
              }
              this.dailyComments.push(data);
            });
          }
          this.dailyCommentsFiltered = this.dailyComments;
        });
      }
    },
  },
};
</script>
