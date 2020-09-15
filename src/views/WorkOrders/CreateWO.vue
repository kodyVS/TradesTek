<template>
  <div class="createWO mt-2">
    <h1>Create Work Order</h1>
    <v-card>
      <v-container mt-12>
        <v-form class="mt-8">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                label="Job Name"
                outlined
                clearable
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-autocomplete
                v-model="customer"
                :items="customerList"
                dense
                outlined
                hide-no-data
                clearable
                filled
                label="Customer"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Address"
                outlined
                clearable
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                value="17921"
                label="PO Number"
                readonly
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field label="Contact Name" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                label="Contact Phone Number"
                outlined
              ></v-text-field>
            </v-col>

            <!-- Date Picker -->

            <v-col cols="12" md="3">
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="formattedDate"
                    label="Start Date"
                    prepend-icon="mdi-calendar-range"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date"></v-date-picker>
              </v-menu>
            </v-col>
            <v-radio-group>
              <v-radio label="Service" value="Service"></v-radio>
              <v-radio label="Construction" value="Construction"></v-radio>
            </v-radio-group>
          </v-row>
          <v-flex md6>
            <v-autocomplete
              v-model="selectedEmployees"
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
            v-model="content"
            label="Job Description"
            prepend-icon="mdi-pencil"
            :rules="inputRules"
          ></v-textarea>
          <!-- <p>{{ employees }}</p> -->

          <!-- <v-col> -->
          <v-btn text class="success px-3 mt-0" @click="submit">Create</v-btn>
          <!-- </v-col> -->
        </v-form>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      title: "",
      content: "",
      date: null,
      inputRules: [],
      customer: [],
      employees: [],
      selectedEmployees: [],
      customerList: [],
    };
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("Do MMMM YYYY") : "";
    },
  },
  created() {
    this.getCustomers();
    this.customerPopulate();
    this.getEmployees();
  },
  methods: {
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
      console.log(this.employees);
    },
    customerPopulate() {
      if (this.$store.state.itemInfo) {
        this.customer = this.$store.state.itemInfo.FullName;
      }
    },
    async getCustomers() {
      this.customerList = await this.$store.dispatch("getCustomers");
      this.customerList = this.customerList.map((customer) => {
        return customer.FullName;
      });
    },
    submit() {
      if (this.$refs.form.validate()) {
        console.log(this.title, this.content);
      }
    },
    remove(item) {
      const index = this.selectedEmployees.indexOf(item.Name);
      if (index >= 0) this.selectedEmployees.splice(index, 1);
    },
  },
};
</script>
