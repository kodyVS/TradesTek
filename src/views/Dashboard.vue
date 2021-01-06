<script>
//todo FIX the position on the intervals
</script>
<template>
  <v-container fluid>
    <v-row justify="center" noGutters>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Employees"
          single-line
          hide-details
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="header-area">
          <v-sheet>
            <v-toolbar flat dense width="100vh">
              <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday"> Today </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-sheet>
        </div>
        <v-progress-linear
          v-show="isLoading"
          color="blue"
          indeterminate
          rounded
          height="4"
          class="header-area"
        ></v-progress-linear>
        <vue-custom-scrollbar :settings="settings" v-dragscroll>
          <v-sheet height="70vh" :width="tableWidth" :max-width="tableWidth">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              type="category"
              category-show-all
              category-hide-dynamic
              :categories="filteredList"
              :event-color="getEventColor"
              :events="events"
              :interval-width="50"
              :interval-height="50"
              :event-height="50"
              @click:event="showEvent"
            >
              <template v-slot:event="{ event }">
                <v-row class="ml-1 mt-1" noGutters>
                  <v-col v-if="!event.timedIn">
                    {{ event.name }}
                  </v-col>
                  <v-col v-if="event.timedIn" justify="center" align="center" class="white--text">
                    {{ event.name }} - Currently Timed In
                  </v-col>
                </v-row>
                <v-row class="ml-1" noGutters>
                  <v-col cols="6"> PO {{ event.PONumber }} </v-col>
                  <v-col v-if="event.startTime" cols="3">
                    {{ event.startTime }} - {{ event.endTime }}</v-col
                  >
                </v-row>
              </template>
            </v-calendar>
          </v-sheet>
        </vue-custom-scrollbar>

        <!-- Card that pops up when you click on an event -->

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" :width="400" flat>
            <v-toolbar dark :color="selectedEvent.color">
              <v-btn icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-text="selectedEvent.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-form ref="form">
              <v-card-text>
                <!-- Date Picker -->
                <p>{{ selectedEvent.PONumber }}</p>

                <v-flex>
                  <v-row>
                    <v-flex xs12 md8 offset-md1>
                      <v-menu>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :value="formattedStartDate"
                            label="Start Date"
                            prepend-icon="mdi-calendar-range"
                            dense
                            readonly
                            :rules="requiredRule"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="selectedEvent.startDate"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 md8 offset-md1>
                      <v-menu v-if="!selectedEvent.includesTime">
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :value="formattedEndDate"
                            label="End Date"
                            readonly
                            prepend-icon="mdi-calendar-range"
                            dense
                            :rules="!selectedEvent.includesTime ? requiredRule : []"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="selectedEvent.endDate"></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-row>
                  <v-row>
                    <v-flex xs12 md8 offset-md1 class="mb-2">
                      <v-checkbox
                        v-model="selectedEvent.includesTime"
                        label="Include Time?"
                        color="indigo darken-3"
                        hide-details
                        dense
                      ></v-checkbox>
                    </v-flex>
                  </v-row>
                  <v-row v-if="selectedEvent.includesTime">
                    <v-flex xs12 md8 offset-md1>
                      <v-text-field
                        v-model="selectedEvent.startTime"
                        type="time"
                        dense
                        :rules="selectedEvent.includesTime ? requiredRule : []"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md8 offset-md1>
                      <v-text-field
                        v-model="selectedEvent.endTime"
                        type="time"
                        dense
                        :rules="selectedEvent.includesTime ? requiredRule : []"
                      ></v-text-field>
                    </v-flex>
                  </v-row>
                </v-flex>

                <!-- Employee Filter -->
                <v-flex md12>
                  <v-autocomplete
                    v-model="selectedEvent.employees"
                    :items="employees"
                    filled
                    chips
                    clearable
                    color="blue-grey lighten-2"
                    label="Assign Employees"
                    item-text="Name"
                    item-value="Name"
                    multiple
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        small
                        color="blue darken-3 white--text"
                        @click="data.select"
                        @click:close="remove(data.item)"
                      >
                        {{ data.item.Name }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item"></v-list-item-content>
                      </template>
                      <template v-else>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ data.item.Name }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ data.item.FieldType }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </v-card-text>

              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false"> close </v-btn>
                <v-btn text @click.prevent="editWorkOrder()"> Save Changes </v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click.prevent="workOrderRoute()"> more... </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import moment from "moment";
import { dragscroll } from "vue-dragscroll";
export default {
  components: {
    vueCustomScrollbar,
  },
  directives: {
    dragscroll,
  },
  data: () => ({
    isLoading: false,
    search: "",
    type: "day",
    viewWidth: "1500px",
    tableWidth: "500px",
    requiredRule: [(v) => !!v || "required"],
    settings: {
      suppressScrollY: false,
      suppressScrollX: false,
    },
    currentView: 1,
    workOrders: [],
    employeeNames: [],
    employees: [],
    focus: "",
    events: [],
    //information on selected event
    currentlyEditing: true,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
  }),
  computed: {
    // size() {
    //   const size = { xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }[
    //     this.$vuetify.breakpoint.name
    //   ];
    //   return size ? { [size]: true } : {};
    // },
    formattedStartDate() {
      return this.selectedEvent.startDate
        ? moment(this.selectedEvent.startDate).format("Do MMMM YYYY")
        : "";
    },
    formattedEndDate() {
      return this.selectedEvent.endDate
        ? moment(this.selectedEvent.endDate).format("Do MMMM YYYY")
        : "";
    },
    title() {
      const start = this.$refs.calendar.lastStart;
      if (!start) {
        return "no start";
      }
      const startMonth = this.monthFormatter(start);
      const startYear = start.year;
      const startDay = start.day + this.nth(start.day);
      return `${startMonth} ${startDay} ${startYear}`;
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
    filteredList() {
      return this.employeeNames.filter((employee) => {
        return employee.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  watch: {
    filteredList() {
      if (this.filteredList.length > 3) {
        this.tableWidth = this.filteredList.length * 250;
      } else {
        this.tableWidth = this.filteredList.length * 400;
      }
    },
  },
  mounted() {
    this.getEmployees();
    this.getWorkOrders();
    //this.$refs.calendar.checkChange();
  },

  methods: {
    workOrderRoute() {
      let workOrder = this.workOrders.filter((workOrder) => {
        return workOrder._id === this.selectedEvent._id;
      });
      this.$store.state.item = workOrder[0];
      this.$store.state.item.Job.Customer = workOrder[0].Job.ParentRef.FullName;
      this.$router.push("WorkOrderForum");
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = JSON.parse(JSON.stringify(event));
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
      this.employeeNames = this.employees.map((employee) => {
        return employee.Name;
      });
      this.employeeNames.sort();
      this.tableWidth = this.employeeNames.length * 250;
    },
    async getWorkOrders() {
      this.isLoading = true;
      let range;
      if (this.focus === "") {
        range = new Date();
      } else {
        range = new Date(this.focus);
      }
      let lowRange = new Date(range.setDate(range.getDate() - 2)).toISOString();
      let highRange = new Date(range.setDate(range.getDate() + 4)).toISOString();
      this.workOrders = await this.$store.dispatch("getAllActiveWorkOrders", {
        LowRange: lowRange,
        HighRange: highRange,
      });
      this.isLoading = false;
      //called events to be cleared a second time so it clears after the async call happens.
      this.events = [];
      this.workOrders.map((workOrder) => {
        workOrder.TimedInEmployee = [];
        this.employees.map((employee) => {
          if (employee.TimedIn) {
            if (workOrder._id === employee.WOReference._id) {
              workOrder.TimedInEmployee.push(employee.Name);
            }
          }
        });
        if (!workOrder.IncludesTime) {
          workOrder.Employees.map((employee) => {
            let timedIn;
            if (workOrder.TimedInEmployee.indexOf(employee) !== -1) {
              timedIn = true;
            }
            this.events.push({
              _id: workOrder._id,
              name: workOrder.Name,
              start: `${workOrder.StartDate.substr(0, 10)}`,
              end: `${workOrder.EndDate.substr(0, 10)}`,
              startDate: workOrder.StartDate.substr(0, 10),
              endDate: workOrder.EndDate.substr(0, 10),
              description: workOrder.Desc,
              jobType: workOrder.JobType,
              color: workOrder.JobType.Color,
              includesTime: false,
              category: employee,
              PONumber: workOrder.PONumber,
              timedIn: timedIn,
              employees: workOrder.Employees,
            });
          });
        } else {
          workOrder.Employees.map((employee) => {
            let timedIn;
            if (workOrder.TimedInEmployee.indexOf(employee) !== -1) {
              timedIn = true;
            }
            this.events.push({
              _id: workOrder._id,
              name: workOrder.Name,
              start: `${workOrder.StartDate.substr(0, 10)} ${workOrder.StartDate.substr(11, 8)}`,
              end: `${workOrder.StartDate.substr(0, 10)} ${workOrder.EndDate.substr(11, 8)}`,
              startDate: workOrder.StartDate.substr(0, 10),
              endDate: workOrder.EndDate.substr(0, 10),
              startTime: workOrder.StartDate.substr(11, 5),
              endTime: workOrder.EndDate.substr(11, 5),
              description: workOrder.Desc,
              jobType: workOrder.JobType,
              color: workOrder.JobType.Color,
              category: employee,
              includesTime: true,
              PONumber: workOrder.PONumber,
              timedIn: timedIn,
              employees: workOrder.Employees,
            });
          });
        }
        this.isLoading = false;
      });
    },

    async editWorkOrder() {
      if (this.$refs.form.validate()) {
        try {
          let startDate;
          let endDate;
          if (this.selectedEvent.includesTime) {
            if (this.selectedEvent.endTime < this.selectedEvent.startTime) {
              throw new Error("Start time is greater than end time");
            }
            startDate = `${this.selectedEvent.startDate}T${this.selectedEvent.startTime}:00.000z`;
            endDate = `${this.selectedEvent.startDate}T${this.selectedEvent.endTime}:00.000z`;
          } else {
            startDate = `${this.selectedEvent.startDate}T00:00:00.000z`;
            endDate = `${this.selectedEvent.endDate}T23:59:00.000z`;
          }
          await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/workOrder/edit",
            {
              WorkOrderId: this.selectedEvent._id,
              Employees: this.selectedEvent.employees,
              Description: this.selectedEvent.description,
              StartDate: startDate,
              EndDate: endDate,
              IncludesTime: this.selectedEvent.includesTime,
            },
            { withCredentials: true }
          );
          this.getWorkOrders();
          this.selectedOpen = false;
        } catch (error) {
          console.log(error.message);
          let payload = { type: "error" };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          if (error.message) {
            payload.message = error.message;
          }
          this.$store.dispatch("snackBarAlert", payload);
          this.isLoading = false;
        }
      } else {
        alert("Form is invalid, Check dates and Times");
      }
    },
    getEventColor(event) {
      let color = "#2f2f2f";
      this.$store.state.settings.workOrders.jobTypes.map((jobType) => {
        if (jobType.Name === event.jobType.Name) {
          color = jobType.Color;
        }
      });
      return color;
    },
    setToday() {
      this.focus = "";
      this.getWorkOrders();
    },
    prev() {
      this.events = [];
      this.getWorkOrders();
      this.$refs.calendar.prev();
    },
    next() {
      this.events = [];
      this.$refs.calendar.next();
      this.getWorkOrders();
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    remove(item) {
      const index = this.selectedEvent.employees.indexOf(item.Name);
      if (index >= 0) this.selectedEvent.employees.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.header-area {
  position: auto;
  margin: auto;
}

::v-deep .v-calendar-daily_head-weekday,
::v-deep .v-calendar-daily_head-day-label {
  display: none;
}
::v-deep .v-calendar-daily__intervals-body {
  left: 0px;
  background-color: white;
}
::v-deep .v-calendar-daily__day {
}
::v-deep .v-calendar-daily__head {
}
::v-deep .v-calendar-daily__day {
}
</style>
