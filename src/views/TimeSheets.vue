<script>
//General
//todo Change the time format on edit requests to the v-input-field input=time to allow for more consistent results
//todo Convert times into the timezone specified by an env variable
//todo ERROR HANDLE
//todo Less blocking
//todo add a month/year picker
//fix when the employee field gets cleared to remove error

//Specific
//todo getEvents() Filter the times based off month as well and sync 3 months of data on each request  --!Important
//todo Add be able to create and send time to the database
//todo showEvents() research a bit more how this works
</script>

<template>
  <v-row class="fill-height">
    <v-col cols="4">
      <v-autocomplete
        v-model.lazy="employee"
        :items="employees"
        dense
        outlined
        hide-no-data
        filled
        rounded
        label="Employee"
        return-object
        item-text="Name"
        @change="getEvents(storedLowRange, storedHighRange, true)"
        class="pt-5 pl-4"
      ></v-autocomplete>
    </v-col>

    <v-col cols="12">
      <v-sheet>
        <v-toolbar flat color="white">
          <v-btn color="primary" dark @click="showNewTimeDialog()"> New Time </v-btn>
          <v-btn outlined class="mr-4" @click="focus = today"> Today </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-btn-toggle v-model="calendarView" mandatory>
            <v-btn outlined class="mr-4" @click="type = 'day'"> Day </v-btn>
            <v-btn outlined class="mr-4" @click="type = 'week'"> Week </v-btn>
            <v-btn outlined class="mr-4" @click="type = 'month'"> Month </v-btn>
          </v-btn-toggle>

          <v-menu bottom right> </v-menu>
        </v-toolbar>
      </v-sheet>

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
                    ><template v-slot:item="data">
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
                <v-text-field dense v-model="selectedEventTime.start" type="time"></v-text-field>
                <v-text-field dense v-model="selectedEventTime.end" type="time"></v-text-field>
                <v-text-field dense v-model="selectedEventTime.date" type="date"></v-text-field>
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
    storedLowRange: null,
    storedHighRange: null,

    selectedEventTime: {
      date: null,
      start: null,
      end: null,
    },

    //Sets the default calendar view to day week or month (0,1,2)
    calendarView: 1,

    //regex for adding the correct time format when editting an event (time entry)
    timeRules: [
      (value) =>
        /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) (?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/.test(
          value
        ) || "Must format time like 2020-01-01 00:00:00",
    ],

    //For loading in employees and having a selected employee to show times for
    //When this employee is selected it will send a request to the back end to show the employee's times
    employee: {},
    employees: [],
    workOrders: [],
    //holds the value of today's date
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),

    //holds the value of the calendar view
    type: "week",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
    },

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
    //Compute title for the calendar to show current change
    title() {
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
      this.employees = await this.$store.dispatch("getEmployees");
    },

    //gets events when then employee is selected. Sends a request to the database that will filter the times
    //todo getEvents() Filter the times based off month as well and sync 3 months of data on each request
    async getEvents(lowRange, highRange, boolean) {
      let calendarDateStart = new Date(this.start.date);
      let calendarDateEnd = new Date(this.end.date);
      if (!this.storedLowRange) {
        this.storedLowRange = calendarDateStart;
        this.storedHighRange = calendarDateEnd;
      }

      try {
        if (this.employee.Name) {
          if (
            this.storedLowRange.getTime() >= calendarDateStart.getTime() ||
            this.storedHighRange.getTime() <= calendarDateEnd.getTime() ||
            boolean
          ) {
            this.storedEmployee = this.employee.Name;
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
                    color: "#1948f7",
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
    //todo Add be able to create and send time to the database
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
      console.log(this.selectedEventTime);
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

    //deletes event from the database
    async deleteEvent(selectedEvent) {
      (this.selectedOpen = false),
        await this.$store.dispatch("deleteTime", selectedEvent).then(() => {
          this.getEvents(this.storedLowRange, this.storedHighRange, true);
        });
    },

    //Shows a specific event when clicked
    //todo showEvents() reaseach a bit more how this works ( I stole this code )
    showEvent({ nativeEvent, event }) {
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
