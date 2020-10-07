<script>
//Additions
//todo show all times on the day instead of having multiple days
</script>
<template>
  <v-container>
    <v-card>
      <v-flex xs12 md12>
        <v-row justify="center">
          <v-col cols="3">
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
          </v-col>
          <v-col cols="3">
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
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="2">
            <v-text-field v-model="lowRange" dense type="date" @change="getTimes()"></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="highRange" dense type="date" readonly></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-card-actions>
            <v-btn justify="center" color="success" @click="getTimes()">Create Timesheet</v-btn>
          </v-card-actions>
        </v-row>
      </v-flex>
    </v-card>
    <v-card v-if="events.length > 0" class="mt-4">
      <v-card-title
        v-text="` ${employee.Name} Timesheet From ${lowRange} until ${highRange}`"
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
export default {
  data() {
    return {
      events: "",
      employees: [],
      employee: {},
      lowRange: null,
      highRange: null,
      dateRange: { Name: "Bi-weekly", Value: 2 * 7 * 24 * 60 * 60 * 1000 },
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
  watch: {
    lowRange: function () {
      this.getTimes();
    },
  },

  methods: {
    setLowDate() {
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 14);
      this.lowRange = startDate.toISOString().substr(0, 10);
    },

    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
    },
    async getTimes() {
      this.updateDates();
      try {
        let events = [];
        let param = `?filter=${this.employee.Name}&lowRange=${this.lowRange}&highRange=${this.highRange}`; //send parameters for ranges
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
          events.sort(function (a, b) {
            return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
          });
          this.events = events;
          console.log(events);
        });
      } catch (err) {
        console.log(err);
      }
    },
    updateDates() {
      let modifiedDate = new Date(this.lowRange).getTime() + this.dateRange.Value;
      this.highRange = new Date(modifiedDate).toISOString().substr(0, 10);
    },
    timeDisplay(event) {
      return `${Math.round(event.quantity / 60 + Number.EPSILON)} Hrs ${
        event.quantity - 60 * Math.floor(event.quantity / 60 + Number.EPSILON)
      } Minutes`;
    },
  },
};
</script>
