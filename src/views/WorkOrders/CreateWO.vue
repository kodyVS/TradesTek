<template>
  <div class="createWO mt-2">
    <h1>Create Work Order</h1>
    <v-card>
      <v-container mt-12>
        <v-form class="mt-8">
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Job Name"
                outlined
                clearable
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="2">
              <v-text-field
                v-model="customer"
                label="Customer"
                outlined
                clearable
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                label="Address"
                outlined
                clearable
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="2">
              <v-text-field
                value="17921"
                label="PO Number"
                readonly
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="2">
              <v-text-field label="Contact Name" outlined></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                label="Contact Phone Number"
                outlined
              ></v-text-field>
            </v-col>

            <!-- Date Picker -->

            <v-col cols="12" sm="3">
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="formattedDate"
                    label="Due date"
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

          <v-textarea
            v-model="content"
            label="Job Description"
            prepend-icon="mdi-pencil"
            :rules="inputRules"
          ></v-textarea>

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
      customer: "",
    };
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("Do MMMM YYYY") : "";
    },
  },
  created() {
    this.customerPopulate();
  },
  methods: {
    customerPopulate() {
      if (this.$store.state.itemInfo) {
        this.customer = this.$store.state.itemInfo.FullName;
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        console.log(this.title, this.content);
      }
    },
  },
};
</script>
