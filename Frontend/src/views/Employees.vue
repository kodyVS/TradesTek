<script>
//todo Rename to employees
//todo fix naming in this file. I switched around a few names during the build so the naming convention might be confusing
</script>
<template>
  <div class="team">
    <!-- Search function for the table -->
    <v-container mb-4 fluid>
      <v-row justify="center" noGutters>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Employees"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col class="pt-5 ml-3" cols="auto">
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-btn small class="white--text" color="grey darken-3" v-on="on">
                <span>Options</span>
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-checkbox
                  v-model="showHidden"
                  label="Show hidden employees?"
                  class="pt-4"
                ></v-checkbox>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <v-row justify="center" noGutters>
        <v-col cols="auto"> </v-col>
      </v-row>
    </v-container>
    <v-container class="my-5">
      <v-layout wrap>
        <v-flex v-for="(person, index) in filteredList" :key="person.Name" xs12 sm12 md6 lg4 xl3>
          <v-hover v-slot:default="{ hover }">
            <v-card class="text-left ma-3 rounded-card" :elevation="hover ? 16 : 4">
              <v-responsive
                style="text-align: center"
                :class="
                  person.Hidden
                    ? 'pt-2 pb-2 grey'
                    : 'pt-2 pb-2 primary darken-3 white--text elevation-7'
                "
              >
                <span>{{ person.Name }}</span>
                <span v-if="person.Hidden"><i>- Hidden</i></span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-show="hover"
                      color="grey"
                      class="mr-2"
                      style="float: right; position: absolute; right: 0px"
                      @click="editDialog = true"
                      v-on="on"
                      >mdi-account-edit</v-icon
                    >
                  </template>
                  <v-list>
                    <v-list-item @click="employeeEdit(person)">
                      <v-list-item-title> Edit </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="employeeHide(person)">
                      <v-list-item-title>Hide employee</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
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
                <v-row>
                  <v-btn
                    v-if="!person.Hidden"
                    small
                    text
                    color="secondary"
                    class="success ml-4"
                    @click="WorkOrderForum(person)"
                  >
                    <v-icon small left color="white">mdi-folder</v-icon>
                    <span class="white--text">Create WO</span>
                  </v-btn>
                  <v-btn v-if="!person.Hidden" small @click="activeWOButton(index, person)">
                    Active Work Orders
                    <v-icon>{{
                      selectedIndex === index ? "mdi-chevron-up" : "mdi-chevron-down"
                    }}</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="person.Hidden"
                    small
                    class="warning mr-4"
                    @click="restoreEmployee(person)"
                    >Restore hidden Employee</v-btn
                  >
                </v-row>
              </v-card-actions>
              <v-expand-transition>
                <div v-if="index === selectedIndex">
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
import axios from "axios";
export default {
  data() {
    return {
      showHidden: false,
      editDialog: false,
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
  watch: {
    showHidden() {
      this.editData();
    },
  },

  methods: {
    async getData() {
      if (!this.showHidden) {
        this.team = await this.$store.dispatch("getEmployees");
      } else {
        this.team = await this.$store.dispatch("getEmployees", true);
      }
      this.workOrders = await this.$store.dispatch("getAllActiveWorkOrders");
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
    WorkOrderForum(currentPerson) {
      this.$store.state.employeeInfo = currentPerson.Name;
      this.$router.push("WorkOrderForum");
    },

    async workOrdersFilter(person) {
      this.workOrdersFiltered = await this.workOrders.filter(
        (job) => job.Employees.indexOf(person.Name) > -1
      );
    },
    addWO() {
      this.$router.push("WorkOrders");
    },
    async employeeHide(employee) {
      //todo add a confirm method
      let res = await this.$confirm("Are you sure you would like to hide this employee?", {
        color: "warning",
        title: "Are you sure?",
      });
      if (res) {
        try {
          if (employee.workOrders.length > 0) {
            throw new Error("Remove employee from all active work orders before deleting");
          }
          let data = {
            _id: employee._id,
            Hidden: true,
          };
          await axios.post(process.env.VUE_APP_API_URL + "/api/v1/employee/edit", data, {
            params: { id: data._id },
            withCredentials: true,
          });
          let payload = {
            type: "success",
            message: "Employee hidden",
          };
          this.$store.dispatch("snackBarAlert", payload);
          this.editData();
        } catch (error) {
          if (error.message) {
            let payload = {
              type: "error",
              message: error.message,
            };
            this.$store.dispatch("snackBarAlert", payload);
          }
        }
      }
    },
    async restoreEmployee(employee) {
      let res = await this.$confirm("Are you sure you would like to restore this employee?", {
        color: "warning",
        title: "Are you sure?",
      });
      if (res) {
        try {
          let data = {
            _id: employee._id,
            Hidden: false,
          };
          await axios.post(process.env.VUE_APP_API_URL + "/api/v1/employee/edit", data, {
            params: { id: data._id },
            withCredentials: true,
          });
          let payload = {
            type: "success",
            message: "Employee Restored",
          };
          this.$store.dispatch("snackBarAlert", payload);
          this.editData();
        } catch (error) {
          if (error.message) {
            let payload = {
              type: "error",
              message: error.message,
            };
            this.$store.dispatch("snackBarAlert", payload);
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.rounded-card {
  border-radius: 10px;
}
</style>
