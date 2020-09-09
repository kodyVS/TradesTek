<template>
  <div class="createWO mt-2">
    <h1>Create Work Order</h1>
    <v-form class="mt-8">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field value="Job Name" label="Job Name" outlined clearable dense></v-text-field>
          </v-col>

          <v-col cols="12" sm="2">
            <v-text-field value=" Customer Name" label="Customer" outlined clearable dense></v-text-field>
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field value="John Doe" label="Address" outlined clearable dense></v-text-field>
          </v-col>

          <v-col cols="12" sm="2">
            <v-text-field value="17921" label="PO Number" disabled outlined dense></v-text-field>
          </v-col>

          <v-col cols="12" sm="2">
            <v-text-field value="John Doe" label="Contact Name" outlined></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field value="780-555-5432" label="Contact Phone Number" outlined></v-text-field>
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
      </v-container>
      <v-textarea
        label="Job Description"
        v-model="content"
        prepend-icon="mdi-pencil"
        :rules="inputRules"
      ></v-textarea>

      <!-- <v-col> -->
      <v-btn text class="success px-3 mt-0" @click="submit">Create</v-btn>
      <!-- </v-col> -->
    </v-form>
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
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        console.log(this.title, this.content);
      }
    }
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("Do MMMM YYYY") : "";
    }
  }
};
</script>
