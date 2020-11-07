<script>
//todo Rename to employees
//todo fix naming in this file. I switched around a few names during the build so the naming convention might be confusing
</script>
<template>
  <div class="team">
    <h1>Employees</h1>
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
        <v-flex v-for="(person, index) in filteredList" :key="person.Name" xs12 sm12 md6 lg4 xl3>
          <v-hover v-slot:default="{ hover }">
            <v-card class="text-left ma-3 rounded-card" :elevation="hover ? 16 : 4">
              <v-responsive
                style="text-align: center"
                class="pt-2 pb-2 primary darken-3 white--text elevation-7"
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
                <v-btn small text color="secondary" class="success ml-4" @click="createWO(person)">
                  <v-icon small left color="white">mdi-folder</v-icon>
                  <span class="white--text">Create WO</span>
                </v-btn>
                <v-btn small @click="activeWOButton(index, person)">
                  Active Work Orders
                  <v-icon>{{
                    selectedIndex === index ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
                <!--<v-btn
                  v-if="readOnly !== index"
                  disabled
                  small
                  class="ml-2 warning"
                  @click="readOnly = index"
                  >Edit</v-btn
                > -->
                <v-btn v-if="readOnly === index" small class="ml-2 success" @click="readOnly = true"
                  >Save</v-btn
                >
              </v-card-actions>
              <v-expand-transition>
                <div v-if="index === selectedIndex">
                  <!--<v-card-text v-for="job in workOrdersFiltered" :key="job.FullName">
                  {{ job.FullName }}
                </v-card-text>  -->
                  <v-list>
                    <v-subheader>Work Orders</v-subheader>
                    <v-list-item v-for="WO in person.workOrders" :key="WO.FullName" class="ml-4">
                      <v-list-item-content>
                        <v-list-item-title v-text="WO.Name"></v-list-item-title>
                        <v-list-item-subtitle v-text="WO.CustomerRef.FullName">
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-row justify="end" class="mr-2">
                    <v-btn small class="warning mb-2" @click="addWO()">Add Work Order</v-btn>
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
      workOrders: [],
      workOrdersFiltered: [],
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
    this.editData();
  },

  methods: {
    async getData() {
      try {
        this.team = await this.$store.dispatch("getEmployees");
        this.workOrders = await this.$store.dispatch("getAllActiveWorkOrders");
      } catch (err) {
        alert("problem connecting to server");
      }
    },
    async editData() {
      await this.getData().then(() => {
        this.team.map((employee) => {
          employee.workOrders = this.workOrders.filter(
            (WO) => WO.Employees.indexOf(employee.Name) > -1
          );
        });
      });
    },

    //Shows active work Orders
    async activeWOButton(index, person) {
      this.workOrdersFiltered = [];
      await this.workOrdersFilter(person).then(() => {
        this.selectedIndex === index ? (this.selectedIndex = null) : (this.selectedIndex = index);
      });
    },

    //Need to add functionality to push name when clicked to list of employees on the work order
    createWO(currentPerson) {
      this.$store.state.employeeInfo = currentPerson.Name;
      this.$router.push("CreateWO");
    },

    async workOrdersFilter(person) {
      this.workOrdersFiltered = await this.workOrders.filter(
        (job) => job.Employees.indexOf(person.Name) > -1
      );
    },
    addWO() {
      this.$router.push("WorkOrders");
    },
  },
};
</script>

<style scoped>
.rounded-card {
  border-radius: 10px;
}
</style>
