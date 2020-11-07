<script>
//Additions
//todo Add TimeSheet view to add a basic non-calendar view
//todo Change Color based off completed or not

//General
//todo Convert times into the timezone specified by an env variable
//todo ERROR HANDLE
//todo Less blocking
//todo add a month/year picker
//fix when the employee field gets cleared to remove error
//Specific
//todo showEvents() research a bit more how this works
</script>
<template>
  <v-row justify="center">
    <v-flex xs12 md4>
      <!-- Employee search that returns the entire employee object -->
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
        class="pt-5 pl-4"
        @change="getEvents(storedLowRange, storedHighRange, true)"
      ></v-autocomplete>
    </v-flex>
    <h4 v-if="!$vuetify.breakpoint.mdAndUp">{{ title }}</h4>
    <v-col cols="12">
      <v-sheet>
        <!-- Top Bar of calendar -->
        <v-toolbar flat color="white">
          <v-btn color="primary" dark @click="showNewTimeDialog()" v-bind="size"> New Time </v-btn>
          <v-btn outlined class="mr-4" @click="focus = today" v-bind="size"> Today </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$vuetify.breakpoint.mdAndUp">{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn-toggle v-model="calendarView" mandatory v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn outlined class="mr-4" @click="type = 'day'"> Day </v-btn>
            <v-btn outlined class="mr-4" @click="type = 'week'"> Week </v-btn>
            <v-btn outlined class="mr-4" @click="type = 'month'"> Month </v-btn>
          </v-btn-toggle>
          <v-menu offset-y v-else>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small color="primary" dark v-bind="attrs" v-on="on"> Range </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title> Day </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="type = 'month'"> month </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu bottom right> </v-menu>
        </v-toolbar>
      </v-sheet>

      <!-- Dialog for creating a work order -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container class="px-12">
            <v-form @submit.prevent="addTimeStamp">
              <v-row>
                <v-flex>
                  <v-autocomplete
                    v-model="newTime.workOrder"
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
                    <!-- Template for the work order dropdown list -->
                    <template v-slot:item="data">
                      <v-list-item-content>
                        <v-list-item-title>{{ data.item.Name }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          data.item.CustomerRef.FullName.split(":").splice(1).join("")
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="newTime.description"
                    type="text"
                    label="description"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md5>
                  <v-text-field
                    v-model="newTime.start"
                    type="time"
                    label="Start Time (required)"
                  ></v-text-field>
                  <v-text-field
                    v-model="newTime.date"
                    type="date"
                    label="Date (required)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md5>
                  <v-text-field
                    v-model="newTime.end"
                    type="time"
                    label="End Time (required)"
                  ></v-text-field>
                </v-flex>

                <v-autocomplete
                  v-model="newTime.employee"
                  :items="employees"
                  dense
                  outlined
                  filled
                  rounded
                  label="Employee"
                  return-object
                  item-text="Name"
                ></v-autocomplete>
              </v-row>

              <v-btn type="submit" color="primary" class="mr-4"> create time entry </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
      <v-sheet>
        <!-- Code for calendar -->
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :first-interval="0"
          :interval-minutes="60"
          :interval-count="24"
          :event-more="false"
          :type="type"
          event-overlap-mode="column"
          :event-overlap-threshold="30"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <!-- Card that pops up when you click on an event -->
          <v-card color="grey lighten-4" :width="350" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="deleteEvent(selectedEvent)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-text="selectedEvent.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>

            <v-card-text>
              <v-form v-if="currentlyEditing !== selectedEvent.id && selectedEvent.name">
                <p>
                  {{ selectedEvent.start.substr(11, 8) }} - {{ selectedEvent.end.substr(11, 8) }}
                </p>
                <p>
                  {{ selectedEvent.description }}
                </p>
              </v-form>
              <v-form v-else ref="form">
                <v-text-field v-model="selectedEventTime.start" dense type="time"></v-text-field>
                <v-text-field v-model="selectedEventTime.end" dense type="time"></v-text-field>
                <v-text-field v-model="selectedEventTime.date" dense type="date"></v-text-field>
                <v-textarea
                  v-model="selectedEvent.description"
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                  hint="add note"
                  persistent-hint
                >
                </v-textarea>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="
                  selectedOpen = false;
                  currentlyEditing = false;
                "
              >
                close
              </v-btn>
              <v-btn
                v-if="currentlyEditing !== selectedEvent.id"
                text
                @click.prevent="editTime(selectedEvent)"
              >
                edit
              </v-btn>
              <v-btn v-else text type="submit" @click.prevent="updateEvent(selectedEvent)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    //The stored Low range and high range for sending a filter request
    storedLowRange: null,
    storedHighRange: null,

    //The time of a selected event
    selectedEventTime: {
      date: null,
      start: null,
      end: null,
    },

    //Sets the default calendar view to day week or month (0,1,2)
    calendarView: 2,
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
    },
    //For loading in employees and having a selected employee to show times for
    //When this employee is selected it will send a request to the back end to show the employee's times
    employee: {},
    employees: [],
    workOrders: [],
    //holds the value of today's date //todo make sure that this works for early times/other time zones as isoString might change the date
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),

    //New time form information
    newTime: {
      workOrder: null,
      description: null,
      start: null,
      end: null,
      employee: null,
      date: null,
    },
    name: null,
    description: null,
    start1: null,
    end1: null,
    start: null,
    end: null,
    color: "#1976D2", // default event color

    //Boolean if currently editing
    currentlyEditing: null,

    //information on selected event
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    //holds the events (timestamps)
    events: [],

    //Boolean for the dialog
    dialog: false,
  }),
  //When Created get employees
  created() {
    this.getEmployees();
  },

  computed: {
    size() {
      const size = { xs: "small", sm: "medium", lg: "large", xl: "large" }[
        this.$vuetify.breakpoint.name
      ];
      return size ? { [size]: true } : {};
    },
    //Compute title for the calendar to show current change
    title() {
      console.log(this);
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      this.newTime.date = this.start.date;
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;
      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;
      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);
      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
  },
  // 2020-09-29 10:00:00
  methods: {
    //pulls the list of employees from the database
    async getEmployees() {
      console.log(this.$store.state.userEmployeeReference);
      if (this.$store.state.userRole === "admin") {
        this.employees = await this.$store.dispatch("getEmployees");
      } else if (this.$store.state.userRole === "user") {
        let employee = await this.$store.dispatch(
          "getEmployee",
          this.$store.state.userEmployeeReference
        );
        this.employees.push(employee);
        this.employee = employee;
        this.getEvents(this.storedLowRange, this.storedHighRange, true);
        // .then((res) => {
        //   this.employee = res.data;
        // });
      }
    },

    //gets events when then employee is selected. Sends a request to the database that will filter the times
    async getEvents(lowRange, highRange, boolean) {
      let calendarDateStart = new Date(this.start.date);
      let calendarDateEnd = new Date(this.end.date);
      if (!this.storedLowRange) {
        this.storedLowRange = lowRange;
        this.storedHighRange = highRange;
      }

      try {
        if (this.employee.Name) {
          if (
            this.storedLowRange.getTime() >= calendarDateStart.getTime() ||
            this.storedHighRange.getTime() <= calendarDateEnd.getTime() ||
            boolean
          ) {
            this.storedLowRange = lowRange;
            this.storedHighRange = highRange;
            let events = [];
            let param = `?filter=${
              this.employee.Name
            }&lowRange=${lowRange.toISOString()}&highRange=${highRange.toISOString()}`; //send parameters for ranges
            await this.$store.dispatch("getAllTimes", param).then((times) => {
              times.map((time) => {
                if (time.TimeData[1]) {
                  let time1 = new Date(time.TimeData[0]);
                  let time2 = new Date(time.TimeData[1]);
                  events.push({
                    _id: time._id,
                    name: time.WorkOrder,
                    start: `${time.TimeData[0].substr(0, 10)} ${time.TimeData[0].substr(11, 8)}`,
                    end: `${time.TimeData[1].substr(0, 10)} ${time.TimeData[1].substr(11, 8)}`,
                    description: time.Desc,
                    completed: time.Completed,
                    PONumber: time.PONumber,
                    color: `${time.Completed ? "#3EAB2A" : "#1948f7"}`,
                  });
                }
              });
              this.events = events;
              this.newTime.employee = this.employee;
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    //Shows new time dialog
    async showNewTimeDialog() {
      if (this.workOrders.length <= 0) {
        this.workOrders = await this.$store.dispatch("getAllActiveWorkOrders");
      }
      this.dialog = true;
    },

    //view the day and focus on the current date
    viewDay({ date }) {
      this.calendarView = 0;
      this.focus = date;
      this.type = "day";
    },

    //Returns the event color for each event
    getEventColor(event) {
      return event.color;
    },

    //Changes the calendars month
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },

    // Adds a time entry
    async addTimeStamp() {
      if (this.newTime.workOrder && this.newTime.start && this.newTime.end) {
        let time1 = `${this.newTime.date}T${this.newTime.start}:00.000z`;
        let time2 = `${this.newTime.date}T${this.newTime.end}:00.000z`;
        let timeEntry = {
          WorkOrder: this.newTime.workOrder.Name,
          WOReference: this.newTime.workOrder._id,
          TimeData: [time1, time2],
          Desc: this.newTime.description,
          Employee: this.newTime.employee.Name,
          EmployeeReference: this.newTime.employee._id,
          PONumber: this.newTime.workOrder.PONumber,
        };
        await this.$store.dispatch("addTime", timeEntry).then(() => {
          this.getEvents(this.storedLowRange, this.storedHighRange, true);
          this.dialog = false;
          this.newTime = {
            workOrder: null,
            description: null,
            start: null,
            end: null,
            employee: null,
          };
        });
      } else {
        alert("You must enter work order, start, and end time");
      }
    },

    //Opens edit Time
    editTime(selectedEvent) {
      this.currentlyEditing = selectedEvent.id;
      this.selectedEventTime = {
        date: selectedEvent.start.substr(0, 10),
        start: selectedEvent.start.substr(11, 5),
        end: selectedEvent.end.substr(11, 5),
      };
    },

    //Updates event data to the database
    async updateEvent(selectedEvent) {
      if (this.$refs.form.validate()) {
        this.selectedOpen = false;
        this.currentlyEditing = null;
        let editedTime = {
          TimeData: [
            `${this.selectedEventTime.date}T${this.selectedEventTime.start}:00.000z`,
            `${this.selectedEventTime.date}T${this.selectedEventTime.end}:00.000z`,
          ],
          Desc: selectedEvent.description,
          _id: selectedEvent._id,
        };
        await this.$store.dispatch("editTime", editedTime);
      } else {
        alert("Form Invalid");
      }
      this.getEvents(this.storedLowRange, this.storedHighRange, true);
    },

    //fix error on calendar month when deleting the event. selectedEvent is wrong.
    //deletes event from the database
    async deleteEvent(selectedEvent) {
      this.selectedOpen = false;
      await this.$store.dispatch("deleteTime", selectedEvent).then(() => {
        this.getEvents(this.storedLowRange, this.storedHighRange, true);
      });
    },

    //Shows a specific event when clicked
    //todo showEvents() reaseach a bit more how this works ( I stole most of this function )
    showEvent({ nativeEvent, event }) {
      this.currentlyEditing = false;
      const open = () => {
        this.selectedEvent = { ...event };
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

    //Updates the range shown on the calendar
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
      let lowRange = new Date(this.start.date);
      let highRange = new Date(this.end.date);
      lowRange.setMonth(lowRange.getMonth() - 1);
      highRange.setMonth(highRange.getMonth() + 1);

      this.getEvents(lowRange, highRange);
    },

    //Custom filter for filtering the employee search function
    filterObject(item, Text) {
      return (
        item.Name.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1 ||
        item.CustomerRef.FullName.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1
      );
    },
    //Changes the notation on the calendar's numbers
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
  },
};
</script>
