<template>
  <v-container fluid>
    <v-dialog v-model="dialog">
      <Profile :user="selectedItem" @close="dialog = !dialog"></Profile>
    </v-dialog>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Customers"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="users"
      class="elevation-1"
      :items-per-page="20"
      :footer-props="{ 'items-per-page-options': [20, 30, 50, 100] }"
    >
      <template v-slot:top>
        <!-- Top bar -->
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text">Users</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="30px" color="grey darken-1" @click="viewUserDialog(item)">mdi-pencil</v-icon>
        <v-icon size="30px" color="grey darken-1" class="mr-1" @click="deleteUser(item)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
import Profile from "./../Profile.vue";
export default {
  components: { Profile },
  data() {
    return {
      dialog: false,
      selectedItem: {},
      search: "",
      users: [],
      headers: [
        { text: "User Name", value: "Name" },
        { text: "User Email", value: "Email" },
        { text: "User Role", value: "UserRole" },
        { text: "User's Linked Employee", value: "EmployeeReference.Name" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      let response = await axios.get(process.env.VUE_APP_API_URL + "/api/v1/users/all", {
        withCredentials: true,
      });
      this.users = response.data.data;
      console.log(this.users);
    },
    viewUser(item) {
      //view the user in the
      this.$router.push({ name: "Profile", params: { user: item } });
    },
    viewUserDialog(item) {
      this.selectedItem = item;
      console.log(this.selectedItem);
      this.dialog = !this.dialog;
    },
    async deleteUser(item) {
      let res = await this.$confirm(
        "Are you sure you would like to delete this User? Actions cannot be undone",
        {
          color: "warning",
          title: "Are you sure?",
        }
      );
      if (res) {
        item.Active = false;
        try {
          await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/users/editUser",
            { user: item },
            {
              params: { id: item._id },
              withCredentials: true,
            }
          );
          this.editBoolean = !this.editBoolean;
          this.$store.dispatch("snackBarAlert", {
            type: "success",
            message: "Updated User Info",
          });
        } catch (error) {
          this.$store.dispatch("snackBarAlert", {
            type: "error",
            message: `${error.message}`,
          });
        }
      }
    },
  },
};
</script>
