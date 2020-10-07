<script>
//! Not Used - Will delete
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn class="success" v-on="on">New Work Order</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>New Work order</v-card-title>
        <v-form ref="form" class="px-3">
          <v-text-field
            v-model="title"
            label="Title"
            prepend-icon="mdi-folder"
            :rules="inputRules"
          ></v-text-field>
          <v-textarea
            v-model="content"
            label="Information"
            prepend-icon="mdi-pencil"
            :rules="inputRules"
          ></v-textarea>

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
          <!-- <v-col> -->
          <v-btn text class="success px-3 mt-0" @click="submit">Add project</v-btn>
          <!-- </v-col> -->
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      title: "",
      content: "",
      dialog: false,
      date: null,
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"],
    };
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("Do MMMM YYYY") : "";
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        console.log(this.title, this.content);
      }
    },
  },
};
</script>
