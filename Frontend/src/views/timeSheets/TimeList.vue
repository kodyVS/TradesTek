<script>
//Recently made this, still needs a lot of work

//Additions
//todo show all times on the day instead of having multiple days
//fix issue with times not showing up on a specific date
</script>
<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row justify="center" class="mt-5">
          <v-flex v-show="$store.state.userRole === 'admin'" xs10 md3 justify-center pa-1>
            <!-- Employee search -->
            <v-autocomplete
              v-model.lazy="employee"
              :items="employees"
              dense
              outlined
              hide-no-data
              filled
              label="Employee"
              return-object
              item-text="Name"
              @change="getTimes()"
            ></v-autocomplete>
          </v-flex>

          <!-- Range of dates selected -->
          <v-flex xs10 md3 pa-1>
            <v-combobox
              v-model="dateRange"
              dense
              outlined
              :items="dateRanges"
              label="Date Range"
              item-text="Name"
              return-object
              @change="getTimes()"
            ></v-combobox>
          </v-flex>
        </v-row>
        <v-row justify="center">
          <v-flex xs10 md2>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="formattedStartDate"
                  label="Start Date"
                  prepend-icon="mdi-calendar-range"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="lowRange"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-row>
        <v-row justify="center">
          <v-flex xs10 md2>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="formattedEndDate"
                  label="End Date"
                  prepend-icon="mdi-calendar-range"
                  disabled
                  v-on="on"
                ></v-text-field>
              </template>
            </v-menu>
          </v-flex>
        </v-row>

        <v-row justify="center">
          <v-card-actions>
            <v-btn justify="center" color="success" @click="getTimes()">Create Timesheet</v-btn>
          </v-card-actions>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Time Sheet created for range of dates selected -->
    <v-card v-if="events.length > 0" class="mt-4">
      <v-card-title
        v-text="` ${employee.Name} Timesheet From ${formattedStartDate} until ${formattedEndDate}`"
      ></v-card-title>
      <v-list v-for="(event, index) in events" :key="index">
        <v-list-item-content>
          <v-list-item-title
            class="ml-1"
            v-text="new Date(event.date).toString().substr(0, 15)"
          ></v-list-item-title>
          <v-list-item-subtitle
            class="ml-3 mt-1"
            v-text="`${event.start} - ${event.end} ${event.name}`"
          ></v-list-item-subtitle>
          <v-list-item-subtitle class="ml-5 mt-1" v-text="timeDisplay(event)">
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-divider></v-divider>
      </v-list>
    </v-card>
    <v-card v-else-if="!employee.Name" color="grey--text">
      <v-card-title v-text="'Please select an employee'"></v-card-title>
    </v-card>
    <v-card v-else>
      <v-card-title v-text="'No Time Data!'"></v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      //Events are time data
      events: "",
      employees: [],
      employee: {},

      //Time ranges that are sent tot he back end
      lowRange: null,
      highRange: null,
      dateRange: { Name: "Bi-weekly", Value: 2 * 7 * 24 * 60 * 60 * 1000 },

      //used in update dates
      dateRanges: [
        { Name: "Day", Value: 24 * 60 * 60 * 1000 },
        { Name: "Weekly", Value: 7 * 24 * 60 * 60 * 1000 },
        { Name: "Bi-weekly", Value: 2 * 7 * 24 * 60 * 60 * 1000 },
        { Name: "Monthly", Value: 4 * 7 * 24 * 60 * 60 * 1000 },
        { Name: "All", Value: 0 },
      ],
      menu: false,
    };
  },
  created() {
    this.getEmployees();
    this.setLowDate();
  },
  computed: {
    formattedStartDate() {
      return this.lowRange ? moment(this.lowRange).format("Do MMMM YYYY") : "";
    },
    formattedEndDate() {
      return this.highRange ? moment(this.highRange).format("Do MMMM YYYY") : "";
    },
  },
  watch: {
    lowRange: function () {
      this.getTimes();
    },
  },

  methods: {
    //Sets the low side of the dates selected
    setLowDate() {
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 14);
      this.lowRange = startDate.toISOString().substr(0, 10);
    },
    //gets the employees
    async getEmployees() {
      if (this.$store.state.userRole === "admin") {
        this.employees = await this.$store.dispatch("getEmployees");
      } else if (this.$store.state.userRole === "User") {
        let employee = await this.$store.dispatch(
          "getEmployee",
          this.$store.state.userEmployeeReference
        );
        this.employees.push(employee);
        this.employee = employee;
      }
    },

    //Gets the filtered time data
    async getTimes() {
      this.updateDates();
      try {
        let events = [];
        let param = `?filter=${this.employee.Name}&lowRange=${this.lowRange}T00:00:00.000z&highRange=${this.highRange}T23:59:59.000z`; //send parameters for ranges
        await this.$store.dispatch("getAllTimes", param).then((times) => {
          times.map((time) => {
            if (time.TimeData[1]) {
              events.push({
                _id: time._id,
                name: time.WorkOrder,
                date: time.TimeData[0],
                start: time.TimeData[0].substr(11, 8),
                end: time.TimeData[1].substr(11, 8),
                quantity: time.Quantity,
                description: time.Desc,
                completed: time.Completed,
                color: `${time.Completed ? "#3EAB2A" : "#1948f7"}`,
              });
            }
          });
          //Sorts by date
          events.sort(function (a, b) {
            return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
          });
          this.events = events;
        });
      } catch (err) {
        console.log(err);
      }
    },
    //Updates date
    updateDates() {
      let modifiedDate = new Date(this.lowRange).getTime() + this.dateRange.Value;
      this.highRange = new Date(modifiedDate).toISOString().substr(0, 10);
    },
    //Displays the time
    timeDisplay(event) {
      return `${Math.round(event.quantity / 60 + Number.EPSILON)} Hrs ${
        event.quantity - 60 * Math.floor(event.quantity / 60 + Number.EPSILON)
      } Minutes`;
    },
  },
};
</script>
