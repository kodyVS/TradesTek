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
                :rules="NameRules"
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
                :items="customerList"
                dense
                outlined
                hide-no-data
                :clearable="!editBoolean"
                :readonly="editBoolean"
                filled
                label="Job Site"
                :rules="NameRules"
                return-object
                item-text="Name"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                :value="getCustomer"
                label="Customer"
                outlined
                readonly
                dense
                :rules="NameRules"
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
                    label="Start Date"
                    prepend-icon="mdi-calendar-range"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date"></v-date-picker>
              </v-menu>
            </v-col>
            <v-radio-group v-model="workOrder.JobType" :rules="NameRules">
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
          <v-btn v-if="!editBoolean" text class="success px-3 mt-0" @click="submit">Submit</v-btn>
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
      NameRules: [(v) => !!v || "required"],
      customer: [],
      employees: [],
      customerList: [],
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
      return this.workOrder.Job.ParentRef.FullName;
    },
    getAddress: function () {
      if (this.workOrder.Job.BillAddress) {
        return this.workOrder.Job.BillAddress.Addr1;
      } else {
        return "";
      }
    },
  },
  created() {
    this.getCustomers();
    this.jobEditPopulate();
    this.getEmployees();
  },
  beforeDestroy() {
    this.editBoolean = false;
  },
  methods: {
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
    },
    jobEditPopulate() {
      if (this.$store.state.item) {
        this.workOrder = this.$store.state.item;
        this.editBoolean = true;
        this.$store.state.item = null;
      }
      console.log(this.workOrder);
    },
    async getCustomers() {
      this.customerList = await this.$store.dispatch("getJobs");
    },
    async submit() {
      if (this.$refs.form.validate()) {
        const req = await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/workOrder/add", {
            Name: this.workOrder.Name,
            Job: this.workOrder.Job._id,
            JobName: this.workOrder.Job.FullName,
            JobType: this.workOrder.JobType,
            Employees: this.workOrder.Employees,
            Description: this.workOrder.Description,
            Complete: this.workOrder.Complete,
            Synced: false,
          })
          .then(async () => {
            this.$router.replace(`WorkOrders`);
          })
          .catch((err) => console.log(err, req));
      }
    },
    async editSubmit() {
      if (this.$refs.form.validate()) {
        if (this.workOrder.Complete === true) {
          await axios
            .post(process.env.VUE_APP_API_URL + "/api/v1/workOrder/complete", {
              WorkOrderID: this.workOrder._id,
              Complete: this.workOrder.Complete,
              Synced: false,
            })
            .catch((err) => console.log(err, req));
        }
        const req = await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/workOrder/edit", {
            WorkOrderId: this.workOrder._id,
            Name: this.workOrder.Name,
            Job: this.workOrder.Job._id,
            JobType: this.workOrder.JobType,
            Employees: this.workOrder.Employees,
            Description: this.workOrder.Description,
            Complete: this.workOrder.Complete,
            Synced: false,
          })
          .then(async () => {
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
