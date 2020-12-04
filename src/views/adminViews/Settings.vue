<template>
  <v-container fluid>
    <h2 class="mb-5">Settings</h2>
    <v-expansion-panels multiple>
      <!--WORK ORDER EXPANSION PANEL -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-col cols="10">
            <b>{{ settings.workOrders.title }}</b>
          </v-col>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <h4 style="color: grey">Job Types</h4>
          <div
            v-for="(workOrderSettings, index) in settings.workOrders.jobTypes"
            :key="index"
            class="ml-3"
          >
            <v-row>
              <v-col md="2">
                <v-text-field dense v-model="workOrderSettings.Name" label="Name"></v-text-field>
              </v-col>
              <v-col md="2">
                <v-text-field dense v-model="workOrderSettings.Color" label="Color"></v-text-field>
              </v-col>
            </v-row>
          </div>
          <v-btn small color="success">Add new Job class</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- ACCOUNTING SOFTWARE EXPANSION PANEL -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-col cols="10">
            <b>{{ settings.accounting.title }}</b>
          </v-col>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <h5 style="color: grey">Software options</h5>
          <v-row>
            <v-col md="2">
              <v-combobox
                v-model="settings.accounting.softwareChoice"
                :items="settings.accounting.softwares"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row class="mt-4" justify="end">
      <v-col md="1">
        <v-btn @click="save()">Save changes</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      panel: [],
      settings: {
        workOrders: {
          title: "Work Order Settings",
          jobTypes: [
            { Name: "Service", Color: "success" },
            { Name: "Construction", Color: "warning" },
          ],
        },
        accounting: {
          title: "Accounting Software",
          softwares: ["Quickbooks Desktop", "QuickBooks Online", "None"],
          softwareChoice: "Quickbooks Desktop",
        },
      },
    };
  },
  created() {},
  methods: {
    save() {
      console.log(this.settings);
    },
  },
};
</script>
<style scoped>
.container {
  background-color: white;
}
</style>
