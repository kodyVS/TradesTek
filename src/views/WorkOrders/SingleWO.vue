//todo Line up UTC times to not overlap with other times
<template>
  <div class="mt-6">
    <v-btn @click="$router.go(-1)">Back to Overview</v-btn>

    <v-container class="mt-4">
      <v-flex>
        <v-card xs-12 class="mb-4">
          <v-card-title class="justify-center">
            <h2>{{ workOrder.Name }}</h2>
          </v-card-title>
          <v-card-subtitle class="text-center black--text"
            ><i>{{ workOrder.Complete ? "Completed" : "Active" }}</i></v-card-subtitle
          >
          <v-card-text class="text-center black--text">{{ workOrder.Description }}</v-card-text>
        </v-card>
      </v-flex>
      <v-row class="justify-center">
        <v-flex xs12 sm6>
          <v-card hover>
            <v-card-title>
              <h3>Work Order Information</h3>
            </v-card-title>
            <v-card-subtitle></v-card-subtitle>
            <v-card-text>
              <h3>Customer: {{ workOrder.Job.ParentRef.FullName }}</h3>
              <h3>Contact Name: {{ workOrder.Job.FirstName + " " + workOrder.Job.LastName }}</h3>
              <h3>Email: {{ workOrder.Job.Email }}</h3>
              <h3>Phone: {{ workOrder.Job.Phone }}</h3>
              <h3>
                Location:
                {{
                  `${workOrder.Job.BillAddress.Addr1 ? workOrder.Job.BillAddress.Addr1 : ""} ${
                    workOrder.Job.BillAddress.City ? workOrder.Job.BillAddress.City : ""
                  }`
                }}
              </h3>
              <h3>Description: {{ workOrder.Description }}</h3>
              <p></p>
            </v-card-text>

            <v-card-actions>
              <v-btn color="success">Click #1</v-btn>
              <v-btn color="primary" @click="editWorkOrder()">Edit</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>mdi-bookmark</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 sm5 class="ml-4">
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
        <v-flex>
          <v-card class="mt-4 text-center">
            <v-card-title class="justify-center">
              <v-btn large color="success darken-1" @click="showTimeBreakdown(false)">
                <span> Show Time breakdown </span>
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
                >
                </v-data-table>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </v-flex>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showComments: false,
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
  },
  //at create call getWorkOrders
  created() {
    this.getWorkOrder();
  },
  methods: {
    //Call get work order from the database
    async getWorkOrder() {
      this.workOrder = await this.$store.dispatch("getWorkOrder", this.$route.params.id);
      console.log(this.workOrder);
    },

    //send work order to the edit/create work order function
    editWorkOrder() {
      this.$store.state.item = this.workOrder;
      this.$router.replace({ name: "CreateWO" });
    },

    //Shows the breakdown of the times
    //todo lazyload this data instead of loading on button push
    showTimeBreakdown() {
      this.showComments = !this.showComments;
      if (this.dailyComments.length < 1) {
        this.workOrder.TimeReference.map((timeStamp) => {
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
    },
  },
};
</script>
