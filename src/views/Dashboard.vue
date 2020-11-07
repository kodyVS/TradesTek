<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Employees"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-container>
      <v-row>
        <v-col>
          <div class="header-area">
            <v-sheet>
              <v-toolbar flat>
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
            color="blue"
            indeterminate
            rounded
            height="4"
            class="header-area"
            v-show="isLoading"
          ></v-progress-linear>

          <vue-custom-scrollbar class="scroll-area" :settings="settings">
            <v-sheet :width="tableWidth">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                type="category"
                category-show-all
                category-hide-dynamic
                :categories="filteredList"
                :category-days="1"
                :event-color="getEventColor"
                :events="events"
                @click:event="showEvent"
                :interval-width="50"
                :interval-height="60"
                :event-height="60"
              >
                <template v-slot:event="{ event }">
                  <v-row class="ml-1 mt-1"> {{ event.name }}</v-row>
                  <v-row class="ml-1">PO {{ event.PONumber }}</v-row>
                  <v-row
                    justify="center"
                    align="center"
                    v-if="event.timedIn"
                    class="ml-1 white--text"
                    ><b>Currently Timed In</b></v-row
                  >
                </template>
              </v-calendar>

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
                                  v-on="on"
                                  dense
                                  readonly
                                  :rules="requiredRule"
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
                                  v-on="on"
                                  dense
                                  :rules="!selectedEvent.includesTime ? requiredRule : []"
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
            </v-sheet></vue-custom-scrollbar
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import moment from "moment";
export default {
  components: {
    vueCustomScrollbar,
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
      wheelPropagation: false,
    },
    currentView: 1,
    workOrders: [],
    employeeNames: [],
    employees: [],
    focus: "",
    events: [],
    colors: ["blue", "indigo", "deep-purple", "cyan", "green", "orange", "grey darken-1"],
    //information on selected event
    currentlyEditing: true,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
  }),
  mounted() {
    this.getEmployees();
    this.getWorkOrders();
    //this.$refs.calendar.checkChange();
  },
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
  methods: {
    workOrderRoute() {
      let workOrder = this.workOrders.filter((workOrder) => {
        return workOrder._id === this.selectedEvent._id;
      });
      console.log(workOrder);
      this.$store.state.item = workOrder[0];
      this.$store.state.item.Job.Customer = workOrder[0].Job.ParentRef.FullName;
      this.$router.push("createWO");
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
        if (workOrder.IsPending === true) {
          workOrder.Color = "purple";
        } else if (workOrder.JobType === "Service") {
          workOrder.Color = "success darken-1";
        } else {
          workOrder.Color = "#1500b5";
        }

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
              color: workOrder.Color,
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
              end: `${workOrder.EndDate.substr(0, 10)} ${workOrder.EndDate.substr(11, 8)}`,
              startDate: workOrder.StartDate.substr(0, 10),
              endDate: workOrder.EndDate.substr(0, 10),
              startTime: workOrder.StartDate.substr(11, 5),
              endTime: workOrder.EndDate.substr(11, 5),
              description: workOrder.Desc,
              color: workOrder.Color,
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
      if (this.$refs.form.validate() && this.selectedEvent.endTime > this.selectedEvent.startTime) {
        try {
          let startDate;
          let endDate;
          if (this.selectedEvent.includesTime) {
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
        } catch (err) {
          alert(err.message);
        }
      } else {
        alert("Form is invalid, Check dates and Times");
      }
    },
    getEventColor(event) {
      return event.color;
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
::v-deep v-calendar-category__column-header {
  min-width: 1000px;
}

.header-area {
  position: auto;
  margin: auto;
  width: 1500px;
}

.scroll-area {
  position: auto;
  margin: auto;
  height: 700px;
  width: 1500px;
}
::v-deep .v-calendar-daily_head-weekday,
::v-deep .v-calendar-daily_head-day-label {
  display: none;
}
::v-deep .v-select__selections {
  margin-top: 10px;
}
</style>
