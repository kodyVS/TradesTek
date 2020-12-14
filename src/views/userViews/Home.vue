<template>
  <div id="myStyle" class="myStyle">
    <v-container fluid>
      <v-layout v-if="!selectedWOID">
        <v-flex>
          <v-row class="justify-center">
            <v-btn-toggle v-model="view" dark class="mt-4">
              <v-btn dark>View All</v-btn>
              <v-btn dark disabled>View By Date</v-btn>
            </v-btn-toggle>
          </v-row>

          <v-row class="align-center justify-center">
            <v-flex v-for="(workOrder, index) in workOrders" :key="index" md6 xs12 lg4>
              <v-card class="mt-3" @click="viewSingleWO(workOrder)">
                <v-responsive
                  :class="`justify-center white--text title elevation-7 pa-1 ${jobColor(
                    workOrder.JobType
                  )}`"
                  style="text-align: center"
                  ><v-icon class="icon" color="yellow darken-2">mdi-star</v-icon>
                  <span>{{ workOrder.Name }}</span>
                  <span v-if="employee.WOReference === workOrder._id" class="timedInCss">
                    -timed in</span
                  >
                </v-responsive>
                <v-card-text class="mt-n2 body">
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
                    <a
                      :href="`https://www.google.com/maps/search/?api=1&query=${getAddressString(
                        workOrder
                      )}`"
                      >{{ getAddressString(workOrder) }}</a
                    >
                  </h4>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-row>
        </v-flex>
      </v-layout>
      <v-btn v-if="selectedWOID" @click="selectedWOID = null">Go back</v-btn>
      <v-dialog v-model="uploadDialog" max-width="300px">
        <v-card v-if="uploadDialog">
          <v-card-title>
            <span>Choose File type</span>
            <v-spacer></v-spacer>
            <v-icon @click="uploadDialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-row justify="center">
            <v-card-text> Upload an image or a document</v-card-text>
          </v-row>

          <v-row justify="center">
            <v-card-actions>
              <v-btn-toggle>
                <v-btn disabled color="primary" text> File </v-btn>
                <v-btn color="green darken-1" text @click="imageUpload()"> Image </v-btn>
              </v-btn-toggle>
            </v-card-actions></v-row
          >
          <v-row justify="center" class="mt-12">
            <v-flex xs8>
              <upload :workOrderID="selectedWOID"></upload>
            </v-flex>
          </v-row>
        </v-card>
      </v-dialog>
      <SingleWO v-if="selectedWOID" :selectedWO="selectedWO" />

      <v-bottom-navigation dense fixed max-height="40px" bottom dark class="appBar">
        <v-row justify="center" class="">
          <v-btn
            v-if="!employee.TimedIn"
            v-bind="size"
            :disabled="!selectedWOID || employee.TimedIn"
            class="white--text"
            active-class="white--text"
            active="white--text"
            color="success"
            @click="timeIn()"
            >Time In</v-btn
          >
          <v-btn
            v-if="employee.TimedIn"
            v-bind="size"
            active-class="white--text"
            color="success darken-2 white--text"
            :disabled="selectedWOID !== employee.WOReference || !employee.TimedIn"
            @click="timeOut()"
            >Time Out</v-btn
          >
          <v-btn
            active-class="white--text"
            class="white--text"
            v-bind="size"
            :disabled="!selectedWOID"
            color="secondary"
            >Lunch</v-btn
          >
          <v-btn
            active-class="white--text"
            v-bind="size"
            :disabled="!selectedWOID"
            color="warning"
            @click="completeWO"
            >Complete WO</v-btn
          >
          <v-btn
            v-bind="size"
            :disabled="!selectedWOID"
            color="primary"
            active-class="white--text"
            @click="uploadDialog = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>
      </v-bottom-navigation>
    </v-container>
  </div>
</template>

<script>
import SingleWO from "../WorkOrders/SingleWO.vue";
import upload from "../../components/upload.vue";
let axios = require("axios");
export default {
  components: {
    SingleWO,
    upload,
  },
  data() {
    return {
      uploadDialog: false,
      workOrders: [],
      description: "",
      employee: {},
      view: 0,
      status: [],
      selectedWOID: null,
      selectedWO: null,
    };
  },
  computed: {
    size() {
      const size = { xs: "small", sm: "medium", lg: "large", xl: "large" }[
        this.$vuetify.breakpoint.name
      ];
      return size ? { [size]: true } : {};
    },
  },
  mounted() {
    this.getEmployee().then(() => {
      this.getAllActiveWorkOrders();
    });
  },

  methods: {
    async getAllActiveWorkOrders() {
      let workOrders = await this.$store.dispatch("getAllActiveWorkOrders", {
        Name: this.employee.Name,
      });
      this.workOrders = workOrders.filter((workOrder) => {
        if (workOrder.IsPending === false) {
          return true;
        }
      });
    },
    async getEmployee() {
      this.employee = await this.$store.dispatch(
        "getEmployee",
        this.$store.state.userEmployeeReference
      );
    },
    jobColor(jobType) {
      if (jobType === "Service") {
        return "primary darken-2";
      } else if (jobType === "Construction") {
        return "warning";
      } else {
        return "grey";
      }
    },
    //Creates the address string
    getAddressString: function (workOrder) {
      return `${workOrder.Job.BillAddress.Addr1 ? workOrder.Job.BillAddress.Addr1 : ""} ${
        workOrder.Job.BillAddress.City ? workOrder.Job.BillAddress.City : ""
      } ${workOrder.Job.BillAddress.PostalCode ? workOrder.Job.BillAddress.PostalCode : ""}`;
    },
    viewSingleWO(workOrder) {
      this.selectedWOID = workOrder._id;
      this.selectedWO = workOrder;
    },
    //Time in Function
    async timeIn() {
      //Check for if there is a work order and employee selected
      if (this.selectedWO._id && this.employee._id) {
        try {
          //create timeStamp of current time
          let timeData = new Date();
          timeData.setHours(timeData.getHours() - 6);
          this.status.push(
            `${this.employee.Name} Timed in at ${timeData
              .toISOString()
              .substr(11, 8)} on ${timeData.toISOString().substr(0, 10)} from ${
              this.selectedWO.Name
            }`
          );
          await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/time/timeIn",
            {
              WorkOrder: this.selectedWO.Name,
              WOReference: this.selectedWO._id,
              Employee: this.employee.Name,
              EmployeeReference: this.employee._id,
              TimeData: timeData,
              TimedIn: true,
              PONumber: this.selectedWO.PONumber,
            },
            { withCredentials: true }
          );
          //if the request comes back successful, reload employees and set the employee's timedIn value to true because the employee data isn't reloaded until selected again
          await this.getEmployee();
        } catch (err) {
          alert(err.message);
        }
      } else {
        //create an alert that tells the user to pick a work order and employee
        alert("pick a work order and employee");
      }
      //alert("pick a work order and employee");
    },

    //Time out function
    async timeOut() {
      try {
        let timeData = new Date();
        timeData.setHours(timeData.getHours() - 6);

        //Pushes time out data into the log
        this.status.push(
          `${this.employee.Name} Timed Out at ${timeData
            .toISOString()
            .substr(11, 8)} on ${timeData.toISOString().substr(0, 10)} from ${this.selectedWO.Name}`
        );
        //Creates timestamp of when the time request finishes

        //sends data to the back end
        await axios.post(
          process.env.VUE_APP_API_URL + "/api/v1/time/timeOut",
          {
            WOReference: this.selectedWO._id,
            EmployeeReference: this.employee._id,
            TimeData: timeData,
            Desc: this.description,
          },
          { withCredentials: true }
        );
        //When data is successful, set employee's TimedIn to false and reload employees
        this.requestStatus = "success";
        this.employee.TimedIn = false;
        this.description = "";
        this.getEmployee();
      } catch (err) {
        alert(err.message);
      }
    },
    //Time pause has not been developed
    timePause() {
      this.status.push(
        `Timed paused at ${new Date()
          .toISOString()
          .substr(11, 8)} on ${new Date().toISOString().substr(0, 10)}`
      );
      this.headingColor = "warning";
    },

    //time Resume has not been developed
    timeResume() {
      this.status.push(
        `Timed resumed at ${new Date()
          .toISOString()
          .substr(11, 8)} on ${new Date().toISOString().substr(0, 10)}`
      );
      this.headingColor = "success";
    },
    async completeWO() {
      try {
        await axios.post(
          process.env.VUE_APP_API_URL + "/api/v1/workOrder/complete",
          {
            WorkOrderID: this.selectedWO._id,
            Complete: this.selectedWO.Complete,
            //todo remove this Synced from being sent, make sure API runs this
            Synced: false,
          },
          { withCredentials: true }
        );
      } catch (err) {
        alert(err.message);
      }
    },
    imageUpload() {},
  },
};
</script>

<style scoped>
.timedInCss {
  font-size: 13px;
  font-style: italic;
}
</style>
