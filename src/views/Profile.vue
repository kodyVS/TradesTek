<template>
  <v-container fluid>
    <v-card v-if="user.Name">
      <v-icon large class="mr-4 mt-4" style="float: right" @click="close()">mdi-close</v-icon>
      <v-card-title>
        <v-icon
          v-if="hover && user.Photo.iconURL"
          size="45"
          class="ml-10"
          color="blue darken-2"
          style="position: absolute"
          >mdi-upload</v-icon
        >
        <v-hover v-model="hover">
          <v-img
            v-if="user.Photo.iconURL"
            class="image"
            :src="user.Photo.iconURL"
            max-width="120px"
            @click="dialog = !dialog"
            alt="Image no longer exists"
          ></v-img>
          <v-icon v-else color="blue darken-2" size="100px" @click="dialog = !dialog"
            >mdi-upload</v-icon
          >
        </v-hover>
        <v-dialog v-model="dialog" height="500px">
          <v-card>
            <v-card-text>
              <upload :imageModel="imageModel" @finished="$router.go()"></upload>
            </v-card-text>
          </v-card>
        </v-dialog>
        <h4 class="ml-4">{{ user.Name }}</h4>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="user.Name" :readonly="!editBoolean" label="Name"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="user.Email"
              :readonly="!editBoolean"
              label="Email"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              v-if="editBoolean && $store.state.userRole === 'admin'"
              v-model="user.EmployeeReference"
              :items="employees"
              label="Linked Quickbooks technician"
              item-text="Name"
              return-object
            ></v-autocomplete>
            <v-text-field
              v-else
              v-model="user.EmployeeReference.Name"
              readonly
              :disabled="editBoolean"
              label="Linked QuickBooks technician"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-combobox
              v-if="$store.state.userRole === 'admin'"
              v-model="user.UserRole"
              :items="$store.state.settings.permissions.roles"
              :readonly="!editBoolean"
              label="Role"
            ></v-combobox>
            <v-text-field v-else :value="user.UserRole" disabled label="Role"> </v-text-field>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!editBoolean" color="warning" @click="editBoolean = !editBoolean">
            Edit User Details
          </v-btn>
          <v-btn v-if="editBoolean" color="success" @click="saveUser()">Save User</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import upload from "../components/upload.vue";
export default {
  components: { upload },
  props: ["user"],
  data() {
    return {
      dialog: false,
      hover: false,
      editBoolean: false,
      email: "",
      confirmEmail: "",
      employees: [],
    };
  },
  computed: {
    imageModel() {
      return {
        id: this.user._id,
        modelName: "user",
      };
    },
  },
  created() {
    this.getUser();
    this.getEmployees();
  },
  methods: {
    async getUser() {
      if (this.user) {
        this.editBoolean = true;
        return;
      }
      let params = this.$store.state.userName;
      let data = await axios.get(process.env.VUE_APP_API_URL + "/api/v1/users/getUser", {
        params: { Name: params },
        withCredentials: true,
      });
      this.user = data.data.data;
    },
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
    },
    async saveUser() {
      try {
        await axios.post(
          process.env.VUE_APP_API_URL + "/api/v1/users/editUser",
          { user: this.user },
          {
            params: { id: this.user._id },
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
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.image:hover {
  opacity: 0.3;
  cursor: pointer;
  transition: 0.5s;
}
</style>
