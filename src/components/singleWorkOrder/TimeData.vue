<template>
  <div>
    <v-flex xs12 class="mt-4" v-if="$store.state.userRole === 'admin'">
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
    <v-flex xs12>
      <v-card class="mt-4 text-center">
        <v-card-title class="justify-center">
          <v-btn large color="success darken-1" @click="showTimeBreakdown(false)">
            <span> Show Time History </span>
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
              class="elevation-1"
            >
            </v-data-table>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
export default {
  props: ["workOrder"],
  data() {
    return {
      //other
      showComments: false,
      timePopulated: false,
      dailyComments: [],
      dailyCommentsFiltered: [],
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
    hoursWorked: function () {
      let totalTime = 0;
      this.workOrder.TimeReference.map((timeStamp) => {
        totalTime = timeStamp.Quantity + totalTime;
      });
      totalTime = Math.round((totalTime / 60 + Number.EPSILON) * 100) / 100;
      return totalTime;
    },
  },
  methods: {
    async showTimeBreakdown() {
      if (this.timePopulated === true) {
        this.showComments = !this.showComments;
      }
      if (this.timePopulated === false) {
        await this.$store.dispatch("getWorkOrder", [this.workOrder._id, true]).then((workOrder) => {
          this.showComments = !this.showComments;
          this.timePopulated = true;
          this.workOrder = workOrder;
          if (this.dailyComments.length < 1) {
            workOrder.TimeReference.sort(function (a, b) {
              return a.TimeData[0] > b.TimeData[1] ? -1 : a.date > b.date ? 1 : 0;
            });
            //Sorted Time Data to show new times first
            workOrder.TimeReference.map((timeStamp) => {
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
        });
      }
    },
  },
};
</script>
