<template>
  <v-container v-if="settings.workOrders" fluid>
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
          <h4 style="color: grey">Job Classes</h4>
          <v-row
            v-for="(workOrderSettings, index) in settings.workOrders.jobTypes"
            :key="index"
            class="ml-3"
          >
            <v-col cols="auto">
              <v-btn fab small class="error" @click="remove(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col sm="2 mt-2">
              <v-text-field v-model="workOrderSettings.Name" dense label="Name"></v-text-field>
            </v-col>
            <v-col sm="2">
              <v-color-picker
                v-model="workOrderSettings.Color"
                hide-inputs
                hide-mode-switch
                hide-canvas
                mode="hexa"
                label="Color"
              ></v-color-picker>
            </v-col>
          </v-row>
          <v-btn small color="success" @click="add">Add new Job class</v-btn>
          <v-row>
            <v-col sm="12">
              <h4 class="mt-12" style="color: grey">Completed work order color</h4>
            </v-col>
            <v-col sm="12">
              <v-color-picker
                v-model="settings.workOrders.completed.color"
                hide-inputs
                hide-mode-switch
                hide-canvas
                mode="hexa"
                label="Color"
              ></v-color-picker>
            </v-col>
            <v-col sm="12 ml-4">
              <v-switch
                v-model="settings.workOrders.reviewBeforeSync"
                label="Review completed work orders before syncing to accounting software?"
              ></v-switch>
              <h4 class="mt-12"></h4>
            </v-col>
          </v-row>
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
            <v-col sm="4">
              <v-combobox
                v-model="settings.accounting.softwareChoice"
                :items="settings.accounting.softwares"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!--PERMISSIONS EXPANSION PANEL -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <!--header-->
          <v-col cols="10">
            <b>{{ settings.permissions.title }}</b>
          </v-col>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!--content-->
          <v-row>
            <v-btn small @click="newRoleBoolean = !newRoleBoolean"> Add new Role </v-btn>
          </v-row>
          <v-row>
            <v-col sm="12 mt-5">
              <h4 style="color: grey">
                <span> Select a role </span>
              </h4>
            </v-col>
            <v-col cols="auto">
              <v-combobox v-model="selectedRole" :items="settings.permissions.roles"></v-combobox>
            </v-col>

            <v-col>
              <v-btn v-if="selectedRole" small color="warning" @click="readOnly = !readOnly"
                >Edit
              </v-btn>
              <v-btn v-if="selectedRole" small color="red" @click="removeRole()">Delete</v-btn>
            </v-col>
          </v-row>

          <v-dialog v-model="newRoleBoolean" height="500px" width="500px" persistent>
            <v-card>
              <v-card-title>Add new Role</v-card-title>
              <v-card-text>
                <v-row justify="center">
                  <v-col cols="auto">
                    <v-text-field v-model="newRole" label="New Role Name"> </v-text-field> </v-col
                ></v-row>
                <v-row justify="center">
                  <v-col cols="auto">
                    <v-btn color="success" @click="addNewRole()">Save</v-btn>
                    <v-btn color="warning" @click="newRoleBoolean = !newRoleBoolean">Cancel</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <div v-if="selectedRole">
            <v-row
              v-for="(permission, index) in settings.permissions.access"
              :key="index"
              no-gutters
            >
              <v-col>
                <v-switch
                  :input-value="haveAccess(permission)"
                  :label="permission.label"
                  @change="changeAccess(permission)"
                ></v-switch>
              </v-col>
            </v-row>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <!--header-->
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!--content-->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row class="mt-4" justify="end">
      <v-col sm="2">
        <v-btn @click="save()">Save changes</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      panel: [],
      selectedRole: "",
      newRole: "",
      newRoleBoolean: false,
      settings: {},
      readOnly: true,
    };
  },
  computed: {},
  created() {
    this.getSettings();
  },
  methods: {
    async initialize() {
      await axios.post(process.env.VUE_APP_API_URL + "/api/v1/settings/create", this.settings, {
        withCredentials: true,
      });
      this.getSettings();
    },
    async getSettings() {
      this.settings = await this.$store.dispatch("getSettings");
    },
    haveAccess: function (permission) {
      let index = permission.roles.indexOf(this.selectedRole);
      if (index === -1) {
        return false;
      }
      return true;
    },
    changeAccess(permission) {
      let index = permission.roles.indexOf(this.selectedRole);
      if (index === -1) {
        permission.roles.push(this.selectedRole);
      } else {
        permission.roles.splice(index, 1);
      }
    },
    async save() {
      try {
        let editedSettings = await this.$store.dispatch("editSettings", this.settings);
        this.settings = editedSettings;
        let payload = { type: "success", message: "Successfully Edited Settings" };

        this.$store.dispatch("snackBarAlert", payload);
        setTimeout(() => {
          this.$router.go();
        }, 1000);
      } catch (error) {
        let payload = { type: "error", message: "error saving setting try again" };
        this.$store.dispatch("snackBarAlert", payload);
      }
    },
    add() {
      this.settings.workOrders.jobTypes.push({
        Name: "",
        Color: "",
      });
    },

    remove(index) {
      this.settings.workOrders.jobTypes.splice(index, 1);
    },
    removeRole() {
      this.settings.permissions.roles = this.settings.permissions.roles.filter((role) => {
        return this.selectedRole !== role;
      });

      let access = this.settings.permissions.access;
      const accessKeys = Object.keys(access);
      accessKeys.map((accessKey) => {
        access[accessKey].roles = access[accessKey].roles.filter((role) => {
          return this.selectedRole !== role;
        });
      });
      this.settings.permissions.access = access;
      this.selectedRole = "";
    },
    addNewRole() {
      this.newRoleBoolean = !this.newRoleBoolean;
      this.settings.permissions.roles.push(this.newRole);
    },
  },
};
</script>
<style scoped>
.container {
  background-color: white;
}
</style>
