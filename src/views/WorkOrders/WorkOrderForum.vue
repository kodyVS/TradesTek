<script>
//todo When completing work orders Add complete to all times associcated with the work order
//todo Add a method to resync workorders after being completed
</script>

<template>
  <v-container fluid class="WorkOrderForum mt-2">
    <v-card class="mt-5">
      <v-card-title>
        <h2 class="mt-2">
          <i>{{ editBoolean ? "Edit Work Order" : "Create Work Order" }}</i>
        </h2>
        <v-spacer></v-spacer>
        <v-icon v-if="editBoolean" large @click="deleteWorkOrder()">mdi-delete</v-icon>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-container mt-2>
        <!-- Form for the creation -->
        <v-form ref="form" class="">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="workOrder.Name"
                label="Work Order Name"
                outlined
                :clearable="!editBoolean"
                :readonly="editBoolean"
                dense
                :rules="lengthRule"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                :value="workOrder.PONumber"
                readonly
                :disabled="!editBoolean"
                label="PO Number"
                hint="PO Number will generate on save"
                :persistent-hint="!editBoolean"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                v-model="workOrder.Job"
                :filter="filterObject"
                :items="jobList"
                dense
                outlined
                hide-no-data
                :clearable="!editBoolean"
                filled
                label="Job Site"
                :rules="requiredRule"
                return-object
                item-text="Name"
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.Name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ data.item.ParentRef.FullName }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                :value="getCustomer"
                label="Customer"
                outlined
                readonly
                hint="This just displays the job information. To edit this navigate to job sites"
                dense
                :rules="requiredRule"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :value="getAddress"
                label="Address"
                outlined
                hint="This just displays the job information. To edit this navigate to job sites"
                dense
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="workOrder.Job.FirstName"
                label="First Name"
                outlined
                readonly
                hint="This just displays the job information. To edit this navigate to job sites"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="workOrder.Job.LastName"
                label="Last Name"
                outlined
                readonly
                hint="This just displays the job information. To edit this navigate to job sites"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="workOrder.Job.Phone"
                label="Contact Phone Number"
                readonly
                outlined
                hint="This just displays the job information. To edit this navigate to job sites"
              ></v-text-field>
            </v-col>

            <!-- Date Picker -->
            <v-flex>
              <v-row>
                <v-flex xs12 md3 offset-md3>
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="formattedStartDate"
                        :label="workOrder.IncludesTime ? 'Date' : 'Start Date'"
                        prepend-icon="mdi-calendar-range"
                        :rules="requiredRule"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="startDate"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3 offset-md1>
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-show="!workOrder.IncludesTime"
                        :value="formattedEndDate"
                        label="End Date"
                        prepend-icon="mdi-calendar-range"
                        :rules="requiredRule"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="endDate"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs12 md2 offset-md1>
                  <v-checkbox
                    v-model="workOrder.IncludesTime"
                    label="Include Time?"
                    color="indigo darken-3"
                    hide-details
                  ></v-checkbox>
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    v-model="startTime"
                    type="time"
                    :disabled="!workOrder.IncludesTime"
                    :rules="workOrder.IncludesTime ? requiredRule : []"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md3 offset-md1>
                  <v-text-field
                    v-model="endTime"
                    type="time"
                    :disabled="!workOrder.IncludesTime"
                    :rules="workOrder.IncludesTime ? requiredRule : []"
                  ></v-text-field>
                </v-flex>
              </v-row>
            </v-flex>
            <v-flex xs12>
              <v-radio-group v-model="jobTypeName" :rules="requiredRule">
                <div v-for="(jobType, index) in jobTypes" :key="index">
                  <v-radio :label="jobType.Name" :value="jobType.Name"></v-radio>
                </div>
              </v-radio-group>
            </v-flex>
          </v-row>
          <v-row>
            <v-flex md6>
              <v-autocomplete
                v-model="workOrder.Employees"
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
            <v-flex v-if="editBoolean" md5 class="ml-4">
              <upload :imageModel="imageModel"></upload>
            </v-flex>
          </v-row>

          <v-textarea
            v-model="workOrder.Description"
            label="Job Description"
            prepend-icon="mdi-pencil"
          ></v-textarea>
          <!-- <v-col> -->
          <v-btn v-if="!editBoolean" text class="success px-3 mt-0" @click="createWorkOrder"
            >Create new WO</v-btn
          >
          <v-btn v-else text class="success px-3 mt-0" @click="editWorkOrder">Save Changes</v-btn>
          <v-btn text class="red white--text px-3 mt-0" @click="$router.go(-1)">Cancel</v-btn>
          <v-switch
            v-if="editBoolean"
            v-model="workOrder.Complete"
            label="Do you wish to complete this work order?"
          ></v-switch>
          <v-switch
            v-if="editBoolean"
            v-model="workOrder.IsPending"
            label="Add to work order review que?"
          ></v-switch>
          <!-- </v-col> -->
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import axios from "axios";
import upload from "../../components/upload.vue";
export default {
  components: { upload: upload },
  data() {
    return {
      jobTypes: "",
      jobTypeName: "",
      includeEndDate: false,
      title: "",
      content: "",
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      editBoolean: false,
      requiredRule: [(v) => !!v || "required"],
      lengthRule: [
        (v) => !!v || "required",
        (v) => (v && v.length <= 30) || "Name must be less than 30 characters",
      ],
      customer: [],
      employees: [],
      jobList: [],
      FullName: "",
      workOrder: {
        Name: "",
        Job: {
          FirstName: "",
          LastName: "",
          Phone: "",
          Email: "",
          ParentRef: {
            FullName: "",
            ListID: "",
          },
        },
        BillAddress: "",
        Employees: [],
        Description: "",
        ListID: "",
        EditSequence: "",
        Complete: false,
        Pending: null,
      },
    };
  },
  computed: {
    //For date picker which is currently disabled
    formattedStartDate() {
      return this.startDate ? moment(this.startDate).format("Do MMMM YYYY") : "";
    },
    formattedEndDate() {
      return this.endDate ? moment(this.endDate).format("Do MMMM YYYY") : "";
    },
    imageModel() {
      return {
        id: this.workOrder._id,
        modelName: "WorkOrder",
      };
    },

    //Used for issues with v-model and attaching to nested objects and autofilling information
    getCustomer: function () {
      if (!this.workOrder.Job) {
        this.clearJob();
        return "";
      } else {
        return this.workOrder.Job.ParentRef.FullName;
      }
    },
    getAddress: function () {
      if (this.workOrder.Job) {
        if (this.workOrder.Job.BillAddress) {
          return this.workOrder.Job.BillAddress.Addr1;
        }
      }
      return "";
    },
  },
  created() {
    this.getJobs();
    this.importStoreData();
    this.getEmployees();
  },
  beforeDestroy() {
    this.editBoolean = false;
  },
  methods: {
    clearJob() {
      this.workOrder.Job = {
        FirstName: "",
        LastName: "",
        Phone: "",
        Email: "",
        ParentRef: {
          FullName: "",
          ListID: "",
        },
      };
      this.workOrder.BillAddress = "";
    },
    //Custom filter for Job Site search
    filterObject(item, Text) {
      return (
        item.Name.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1 ||
        item.ParentRef.FullName.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1
      );
    },
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
    },

    //Used for when importing data from other forums through vuex
    importStoreData() {
      this.jobTypes = this.$store.state.settings.workOrders.jobTypes;
      if (this.$store.state.item) {
        this.workOrder = this.$store.state.item;
        if (this.workOrder.StartDate) {
          this.includeEndDate = true;
          this.startDate = this.workOrder.StartDate.substr(0, 10);
          this.startTime = this.workOrder.StartDate.substr(11, 5);
          if (this.workOrder.EndDate) {
            this.endDate = this.workOrder.EndDate.substr(0, 10);
            this.endTime = this.workOrder.EndDate.substr(11, 5);
          }
        }
        this.$store.state.item = null;
        this.editBoolean = true;
        this.jobTypeName = this.workOrder.JobType.Name;
      }

      if (this.$store.state.itemInfo.Name) {
        this.workOrder.Job = this.$store.state.itemInfo;
        this.$store.state.itemInfo = null;
        this.editBoolean = false;
      }
      if (this.$store.state.employeeInfo) {
        this.workOrder.Employees.push(this.$store.state.employeeInfo);
        this.$store.state.employeeInfo = "";
        this.editBoolean = false;
      }
    },
    async getJobs() {
      this.jobList = await this.$store.dispatch("getJobs");
    },

    //Used when Creating a work order
    async createWorkOrder() {
      let startDate;
      let endDate;
      if (this.workOrder.IncludesTime) {
        startDate = `${this.startDate}T${this.startTime}:00.000z`;
        endDate = `${this.endDate}T${this.endTime}:00.000z`;
      } else {
        startDate = `${this.startDate}T00:00:00.000z`;
        endDate = `${this.endDate}T23:59:00.000z`;
      }
      this.jobTypes.map((jobType) => {
        if (jobType.Name === this.jobType) {
          this.workOrder.JobType = jobType;
        }
      });
      if (this.$refs.form.validate() && !this.editBoolean) {
        try {
          let jobFullName = `${this.workOrder.Job.ParentRef.FullName}:${this.workOrder.Job.Name}`;
          const req = await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/workOrder/add",
            {
              Name: this.workOrder.Name,
              Job: this.workOrder.Job._id,
              JobName: this.workOrder.Job.FullName,
              JobType: this.workOrder.JobType,
              Employees: this.workOrder.Employees,
              Description: this.workOrder.Description,
              Complete: this.workOrder.Complete,
              StartDate: startDate,
              EndDate: endDate,
              IncludesTime: this.workOrder.IncludesTime,
              CustomerRef: {
                FullName: jobFullName,
              },
            },
            { withCredentials: true }
          );
          this.$router.replace(`WorkOrders`);
          let payload = { type: "success", message: "Successfully Created Work Order" };
          this.$store.dispatch("snackBarAlert", payload);
        } catch (error) {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          this.$store.dispatch("snackBarAlert", payload);
        }
      }
    },
    //Used to edit a work order
    async editWorkOrder() {
      if (this.$refs.form.validate()) {
        try {
          let startDate;
          let endDate;
          if (this.workOrder.IncludesTime) {
            startDate = `${this.startDate}T${this.startTime}:00.000z`;
            endDate = `${this.endDate}T${this.endTime}:00.000z`;
          } else {
            startDate = `${this.startDate}T00:00:00.000z`;
            endDate = `${this.endDate}T23:59:00.000z`;
          }
          this.jobTypes.map((jobType) => {
            if (jobType.Name === this.jobTypeName) {
              this.workOrder.JobType = jobType;
            }
          });
          const req = await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/workOrder/edit",
            {
              WorkOrderId: this.workOrder._id,
              Name: this.workOrder.Name,
              Job: this.workOrder.Job._id,
              JobType: this.workOrder.JobType,
              Employees: this.workOrder.Employees,
              Description: this.workOrder.Description,
              Complete: this.workOrder.Complete,
              StartDate: startDate,
              EndDate: endDate,
              IncludesTime: this.workOrder.IncludesTime,
              IsPending: this.workOrder.IsPending,
            },
            { withCredentials: true }
          );
          //If work order edit is successful run the complete work order method
          if (this.workOrder.Complete === true) {
            await axios.post(
              process.env.VUE_APP_API_URL + "/api/v1/workOrder/complete",
              {
                WorkOrderID: this.workOrder._id,
                Complete: this.workOrder.Complete,
                //todo remove this Synced from being sent, make sure API runs this
                Synced: false,
              },
              { withCredentials: true }
            );
          }
          this.$router.replace(`WorkOrders`);
          let payload = { type: "success", message: "Successfully Edited Work Order" };
          this.$store.dispatch("snackBarAlert", payload);
        } catch (err) {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          this.$store.dispatch("snackBarAlert", payload);
        }
      }
    },
    remove(item) {
      const index = this.workOrder.Employees.indexOf(item.Name);
      if (index >= 0) this.workOrder.Employees.splice(index, 1);
    },
    async deleteWorkOrder() {
      let res = await this.$confirm(
        "Are you sure you would like to delete this work Order? Actions cannot be undone",
        {
          color: "warning",
          title: "Are you sure?",
        }
      );

      if (res) {
        try {
          await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/workOrder/delete",
            {
              _id: this.workOrder._id,
            },
            { withCredentials: true }
          );
          let payload = { type: "success", message: "Successfully deleted WorkOrder" };
          this.$store.dispatch("snackBarAlert", payload);
          this.$router.push("WorkOrders");
        } catch (error) {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          this.$store.dispatch("snackBarAlert", payload);
          this.isLoading = false;
        }
      }
    },
  },
};
</script>
<style scoped>
::v-deep .v-select__selections {
  margin-top: 10px;
}
</style>
