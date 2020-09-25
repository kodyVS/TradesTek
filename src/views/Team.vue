<template>
  <div class="team">
    <h1>Team</h1>
    <!-- Search function for the table -->
    <v-container mb-4>
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
    </v-container>
    <v-container class="my-5">
      <v-layout wrap>
        <v-flex
          v-for="(person, index) in filteredList"
          :key="person.Name"
          xs12
          sm12
          md6
          lg4
          xl3
        >
          <v-hover v-slot:default="{ hover }">
            <v-card
              class="text-left ma-3 rounded-card"
              :elevation="hover ? 16 : 4"
            >
              <v-responsive
                style="text-align: center"
                class="pt-2 pb-2 primary darken-3 white--text"
              >
                <span>{{ person.Name }}</span>
              </v-responsive>
              <v-card-text class="secondary--text">
                <v-text-field
                  v-model="person.Phone"
                  label="Phone"
                  :readonly="readOnly !== index"
                  dense
                  append-icon="mdi-phone"
                  @click:append="show = !show"
                ></v-text-field>
                <v-text-field
                  v-model="person.Email"
                  label="Email"
                  :readonly="readOnly !== index"
                  dense
                  append-icon="mdi-email"
                  @click:append="show = !show"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="grey lighten-2">
                <v-btn
                  small
                  text
                  color="secondary"
                  class="success ml-4"
                  @click="createWO(person.Name)"
                >
                  <v-icon small left color="white">mdi-folder</v-icon>
                  <span class="white--text">Create WO</span>
                </v-btn>
                <v-btn small @click="activeJobsButton(index, person)">
                  Active Jobs
                  <v-icon>{{
                    selectedIndex === index
                      ? "mdi-chevron-up"
                      : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
                <v-btn
                  v-if="readOnly !== index"
                  disabled
                  small
                  class="ml-2 warning"
                  @click="readOnly = index"
                  >Edit</v-btn
                >
                <v-btn
                  v-if="readOnly === index"
                  small
                  class="ml-2 success"
                  @click="readOnly = true"
                  >Save</v-btn
                >
              </v-card-actions>
              <v-expand-transition>
                <div v-if="index === selectedIndex">
                  <!--<v-card-text v-for="job in jobsFiltered" :key="job.FullName">
                  {{ job.FullName }}
                </v-card-text>  -->
                  <v-list>
                    <v-subheader>Work Orders</v-subheader>
                    <v-list-item
                      v-for="job in person.Jobs"
                      :key="job.FullName"
                      class="ml-4"
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="job.Name"
                        ></v-list-item-title>
                        <v-list-item-subtitle v-text="job.ParentRef.FullName">
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-row justify="end" class="mr-2">
                    <v-btn small class="warning mb-2">Add Work Order</v-btn>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
//import axios from "axios";
export default {
  data() {
    return {
      team: [],
      search: "",
      selectedIndex: null,
      readOnly: true,
      jobs: [],
      jobsFiltered: [],
    };
  },
  computed: {
    filteredList() {
      return this.team.filter((employee) => {
        return employee.Name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  created() {
    this.getEmployees();
    this.getJobs();
  },

  methods: {
    async getEmployees() {
      this.team = await this.$store.dispatch("getEmployees");
    },
    async getJobs() {
      this.jobs = await this.$store.dispatch("getJobs");
      this.team.map((employee) => {
        employee.Jobs = this.jobs.filter(
          (job) => job.Employees.indexOf(employee.Name) > -1
        );
      });
    },
    async activeJobsButton(index, person) {
      this.jobsFiltered = [];
      if (this.jobs.length < 1) {
        await this.getJobs();
      }
      await this.jobsFilter(person).then(() => {
        this.selectedIndex === index
          ? (this.selectedIndex = null)
          : (this.selectedIndex = index);
      });
    },

    //Need to add functionality to push name when clicked to list of employees on the work order
    createWO(currentPerson) {
      // this.$store.state.itemInfo = `${}`currentPerson;
      this.$router.push("CreateWO");
      console.log(currentPerson);
    },

    async jobsFilter(person) {
      this.jobsFiltered = await this.jobs.filter(
        (job) => job.Employees.indexOf(person.Name) > -1
      );
    },
  },
};
</script>

<style scoped>
.rounded-card {
  border-radius: 10px;
}
</style>
