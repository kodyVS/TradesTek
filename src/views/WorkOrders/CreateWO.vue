<script>
//! FIX BROKEN WORK ORDER SYNCING
//todo rename this to something else
//todo When completing work orders Add complete to all times associcated with the work order
//todo Add a method to resync workorders after being completed
</script>

<template>
  <div class="createWO mt-2">
    <h1>{{ editBoolean ? "Edit Work Order" : "Create Work Order" }}</h1>
    <v-card class="mt-8">
      <v-card-title>{{ workOrder.Name }}</v-card-title>
      <v-container mt-2>
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
                :readonly="editBoolean"
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
                dense
                :rules="requiredRule"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :value="getAddress"
                label="Address"
                outlined
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
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="workOrder.Job.LastName"
                label="Last Name"
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="workOrder.Job.Phone"
                label="Contact Phone Number"
                readonly
                outlined
              ></v-text-field>
            </v-col>

            <!-- Date Picker (Need to figure out back end storage for dates) -->

            <v-col cols="12" md="3">
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    disabled
                    :value="formattedDate"
                    label="Date"
                    prepend-icon="mdi-calendar-range"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date"></v-date-picker>
              </v-menu>
            </v-col>
            <v-radio-group v-model="workOrder.JobType" :rules="requiredRule">
              <v-radio label="Service" value="Service"></v-radio>
              <v-radio label="Construction" value="Construction"></v-radio>
            </v-radio-group>
          </v-row>
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

          <v-textarea
            v-model="workOrder.Description"
            label="Job Description"
            prepend-icon="mdi-pencil"
          ></v-textarea>
          <!-- <v-col> -->
          <v-btn v-if="!editBoolean" text class="success px-3 mt-0" @click="submit"
            >Create new WO</v-btn
          >
          <v-btn v-else text class="success px-3 mt-0" @click="editSubmit">Save Changes</v-btn>
          <v-btn text class="red white--text px-3 mt-0" @click="$router.go(-1)">Cancel</v-btn>
          <v-switch
            v-model="workOrder.Complete"
            label="Do you wish to complete this work order?"
          ></v-switch>
          <!-- </v-col> -->
        </v-form>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      content: "",
      date: null,
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
        JobType: "",
        Employees: [],
        Description: "",
        ListID: "",
        EditSequence: "",
        Complete: false,
      },
    };
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("Do MMMM YYYY") : "";
    },
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
    filterObject(item, Text) {
      return (
        item.Name.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1 ||
        item.ParentRef.FullName.toLocaleLowerCase().indexOf(Text.toLocaleLowerCase()) > -1
      );
    },
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
    },
    importStoreData() {
      if (this.$store.state.item) {
        this.workOrder = this.$store.state.item;
        this.$store.state.item = null;
        this.editBoolean = true;
      }

      if (this.$store.state.itemInfo.Name) {
        this.workOrder.Job = this.$store.state.itemInfo;
        this.$store.state.itemInfo = null;
        this.editBoolean = false;
      }
      if (this.$store.state.employeeInfo) {
        console.log(this.workOrder);
        this.workOrder.Employees.push(this.$store.state.employeeInfo);
        this.$store.state.employeeInfo = "";
        this.editBoolean = false;
      }
    },
    async getJobs() {
      this.jobList = await this.$store.dispatch("getJobs");
    },
    async submit() {
      if (this.$refs.form.validate()) {
        let jobFullName = `${this.workOrder.Job.ParentRef.FullName}:${this.workOrder.Job.Name}`;
        const req = await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/workOrder/add", {
            Name: this.workOrder.Name,
            Job: this.workOrder.Job._id,
            JobName: this.workOrder.Job.FullName,
            JobType: this.workOrder.JobType,
            Employees: this.workOrder.Employees,
            Description: this.workOrder.Description,
            Complete: this.workOrder.Complete,
            CustomerRef: {
              FullName: jobFullName,
            },
          })
          .then(async () => {
            this.$router.replace(`WorkOrders`);
          })
          .catch((err) => console.log(err, req));
      }
    },
    async editSubmit() {
      if (this.$refs.form.validate()) {
        const req = await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/workOrder/edit", {
            WorkOrderId: this.workOrder._id,
            Name: this.workOrder.Name,
            Job: this.workOrder.Job._id,
            JobType: this.workOrder.JobType,
            Employees: this.workOrder.Employees,
            Description: this.workOrder.Description,
            Complete: this.workOrder.Complete,
          })
          .then(async () => {
            if (this.workOrder.Complete === true) {
              await axios
                .post(process.env.VUE_APP_API_URL + "/api/v1/workOrder/complete", {
                  WorkOrderID: this.workOrder._id,
                  Complete: this.workOrder.Complete,
                  //! look into this its broken ATM
                  Synced: false,
                })
                .catch((err) => console.log(err, req));
            }
            this.$router.replace(`WorkOrders`);
          })
          .catch((err) => console.log(err, req));
      }
    },
    remove(item) {
      const index = this.workOrder.Employees.indexOf(item.Name);
      if (index >= 0) this.workOrder.Employees.splice(index, 1);
    },
  },
};
</script>
