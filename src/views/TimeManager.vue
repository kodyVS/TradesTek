<script>
//todo change employees to only match the work orders when they are timed into
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-flex md8>
          <v-card class="mt-4 ml-12">
            <v-card-title class="secondary white--text mb-5 justify-center"
              >Pick a Work Order and an Employee</v-card-title
            >
            <v-autocomplete
              v-model="workOrder"
              :filter="filterObject"
              :items="workOrders"
              clearable
              dense
              outlined
              hide-no-data
              filled
              label="Work Order"
              return-object
              item-text="Name"
              hint="Only shows active work orders"
              persistent-hint
              class="mb-2"
            >
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title>{{ data.item.Name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    data.item.CustomerRef.FullName.split(":").splice(1).join("")
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="employee"
              :items="employees"
              dense
              outlined
              hide-no-data
              filled
              label="Employees"
              return-object
              item-text="Name"
            >
            </v-autocomplete>
            <v-container>
              <v-row :class="headingColor">
                <v-col cols="12" md="12" align="center">
                  <v-btn large :disabled="employee.TimedIn" @click="timeIn()">Time In</v-btn>
                  <v-btn large :disabled="!employee.TimedIn" @click="timeOut()">Time Out</v-btn>
                  <v-btn large @click="timePause()">Lunch</v-btn>
                  <v-btn large @click="timeResume()">Resume</v-btn>
                  <v-btn large @click="status = []">Clear Log</v-btn>
                </v-col>
              </v-row>
              <v-textarea
                v-model="description"
                label="Add Description"
                :persistent-hint="!employee.TimedIn"
                hint="Time in to add description"
                :disabled="!employee.TimedIn"
                outlined
              ></v-textarea>
              <h4 v-for="(timeStamp, index) in status" :key="index" align="center" class="mt-5">
                {{ timeStamp }}
              </h4>
            </v-container>
          </v-card>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs3 sm3 md3 lg3 xl3>
          <v-card>
            <v-col v-for="(singleEmployee, index) in employees" :key="index">
              <h3>
                {{ singleEmployee.Name }}
              </h3>
              <p>
                {{
                  singleEmployee.TimedIn === true
                    ? `Timed into ${singleEmployee.WOReference.Name}`
                    : "Not timed in"
                }}
              </p>
            </v-col>
          </v-card>
        </v-flex>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      workOrder: {},
      workOrders: [],
      employee: {},
      employees: [],
      headingColor: "",
      status: [],
      requestStatus: "",
      description: "",
    };
  },

  //When created Fetch all employees and work orders
  created() {
    this.getAllActiveWorkOrders(), this.getEmployees();
  },
  methods: {
    filterObject(item, Text) {
      return (
        item.Name.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1 ||
        item.CustomerRef.FullName.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1
      );
    },
    //Methods for fetching employees and work orders
    async getAllActiveWorkOrders() {
      this.workOrders = await this.$store.dispatch("getAllActiveWorkOrders");
    },
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
    },

    //Time in Function
    async timeIn() {
      //Check for if there is a work order and employee selected
      try {
        if (this.workOrder._id && this.employee._id) {
          //push info into the log
          this.status.push(
            `${this.employee.Name} Timed In at ${new Date()
              .toISOString()
              .substr(11, 8)} on ${new Date().toISOString().substr(0, 10)} into ${
              this.workOrder.Name
            }`
          );
          //create timeStamp of current time
          let timeData = new Date().toISOString();

          //Send timestamp to the back end and create a time log
          const req = await axios
            .post(process.env.VUE_APP_API_URL + "/api/v1/time/timeIn", {
              WorkOrder: this.workOrder.Name,
              WOReference: this.workOrder._id,
              Employee: this.employee.Name,
              EmployeeReference: this.employee._id,
              TimeData: timeData,
              TimedIn: true,
              PONumber: this.workOrder.PONumber,
            })
            .then(async () => {
              //if the request comes back successful, reload employees and set the employee's timedIn value to true because the employee data isn't reloaded until selected again
              await this.getEmployees().then(() => {
                this.employee.TimedIn = true;
              });
            })
            .catch((err) => console.log(err, req));
        } else {
          //create an alert that tells the user to pick a work order and employee
          alert("pick a work order and employee");
        }
      } catch (err) {
        //alert("pick a work order and employee");
        console.log(err);
      }
    },

    //Time out function
    async timeOut() {
      //Pushes time out data into the log
      this.status.push(
        `${this.employee.Name} Timed Out at ${new Date()
          .toISOString()
          .substr(11, 8)} on ${new Date().toISOString().substr(0, 10)} from ${this.workOrder.Name}`
      );
      //Creates timestamp of when the time request finishes
      let timeData = new Date().toISOString();
      //sends data to the back end
      const req = await axios
        .post(process.env.VUE_APP_API_URL + "/api/v1/time/timeOut", {
          WOReference: this.workOrder._id,
          EmployeeReference: this.employee._id,
          TimeData: timeData,
          Desc: this.description,
        })
        .then(async () => {
          //When data is successful, set employee's TimedIn to false and reload employees
          this.requestStatus = "success";
          this.employee.TimedIn = false;
          this.description = "";
          this.getEmployees();
        })
        .catch((err) => console.log(err, req));
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
  },
};
</script>
