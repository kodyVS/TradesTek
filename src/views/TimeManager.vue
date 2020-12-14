<script></script>

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
              @change="filterEmployees()"
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
              :items="filteredEmployees"
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
                  <v-btn
                    large
                    color="success"
                    :disabled="employee.TimedIn || !employee.Name || isLoading"
                    @click="timeIn()"
                    >Time In</v-btn
                  >
                  <v-btn large :disabled="!employee.TimedIn" @click="timeOut()">Time Out</v-btn>
                  <v-btn large :disabled="!employee.TimedIn || employee.Lunch" @click="timeLunch()"
                    >Lunch</v-btn
                  >
                  <v-btn large :disabled="!employee.Lunch" @click="timeResume()">Resume</v-btn>
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
              <p v-if="!singleEmployee.Lunch">
                {{
                  singleEmployee.TimedIn === true
                    ? `Timed into ${singleEmployee.WOReference.Name}`
                    : "Not timed in"
                }}
              </p>
              <p v-if="singleEmployee.Lunch">Timed into Lunch</p>
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
      isLoading: false,
      workOrder: {},
      workOrders: [],
      employee: {},
      employees: [],
      filteredEmployees: [],
      headingColor: "",
      status: [],
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
    //filter for only showing employees that are assigned to that work order
    filterEmployees() {
      this.employee = {};
      this.filteredEmployees = [];
      this.employees.map((employee) => {
        if (this.workOrder.Employees.indexOf(employee.Name) > -1) {
          this.filteredEmployees.push(employee);
        }
      });
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
      if (this.workOrder._id && this.employee._id) {
        try {
          let timeData = new Date();
          timeData.setHours(timeData.getHours() - 6);
          this.status.push(
            `${this.employee.Name} Timed in at ${timeData
              .toISOString()
              .substr(11, 8)} on ${timeData.toISOString().substr(0, 10)} from ${
              this.workOrder.Name
            }`
          );
          let request = {
            WorkOrder: this.workOrder.Name,
            WOReference: this.workOrder._id,
            Employee: this.employee.Name,
            EmployeeReference: this.employee._id,
            TimeData: timeData,
            TimedIn: true,
            PONumber: this.workOrder.PONumber,
          };

          if (this.lunch) {
            request.Lunch = true;
            request.WorkOrder = "Lunch";
          }
          await axios.post(process.env.VUE_APP_API_URL + "/api/v1/time/timeIn", request, {
            withCredentials: true,
          });
          //if the request comes back successful, reload employees and set the employee's timedIn value to true because the employee data isn't reloaded until selected again
          await this.getEmployees();
          this.employee.TimedIn = true;
        } catch (error) {
          let payload = { type: "error" };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          this.$store.dispatch("snackBarAlert", payload);
        }
      } else {
        //create an alert that tells the user to pick a work order and employee
        let payload = { type: "error", message: "pick a work order and an employee" };
        this.$store.dispatch("snackBarAlert", payload);
      }
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
            .substr(11, 8)} on ${timeData.toISOString().substr(0, 10)} from ${this.workOrder.Name}`
        );
        //Creates timestamp of when the time request finishes

        //sends data to the back end
        await axios.post(
          process.env.VUE_APP_API_URL + "/api/v1/time/timeOut",
          {
            WOReference: this.workOrder._id,
            EmployeeReference: this.employee._id,
            TimeData: timeData,
            Desc: this.description,
          },
          { withCredentials: true }
        );
        //When data is successful, set employee's TimedIn to false and reload employees
        this.employee.TimedIn = false;
        this.description = "";
        await this.getEmployees();
        if (this.lunch) {
          this.employee = this.employees.filter(
            (employee) => this.employee.Name === employee.Name
          )[0];
        }
      } catch (err) {
        alert(err.message);
      }
    },
    async timeLunch() {
      this.isLoading = true;
      this.lunch = true;
      if (this.employee.TimedIn) {
        await this.timeOut();
        await this.timeIn();
      }
      this.lunch = false;
      this.isLoading = false;
    },
    //time Resume has not been developed
    async timeResume() {
      await this.timeOut();
      await this.timeIn();
    },
  },
};
</script>
