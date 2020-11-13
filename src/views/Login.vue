<template>
  <div>
    <v-layout justify-center align-center v-if="!$store.state.userRole">
      <v-card v-model="dialog" class="mt-12">
        <div>
          <v-tabs
            v-model="tab"
            show-arrows
            background-color="primary darken-4"
            icons-and-text
            dark
            grow
            class="elevation-7"
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="(tab, index) in tabs" :key="index" class="elevation-7">
              <v-icon large>{{ tab.icon }}</v-icon>
              <div class="caption py-1">{{ tab.name }}</div>
            </v-tab>
            <v-tab-item>
              <v-progress-linear
                color="blue"
                indeterminate
                rounded
                height="6"
                v-if="isLoading"
              ></v-progress-linear>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="loginForm" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="loginEmail"
                          :rules="loginEmailRules"
                          label="E-mail"
                          required
                          validate-on-blur
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="loginPassword"
                          :rules="[rules.required]"
                          :type="show1 ? 'text' : 'password'"
                          label="Password"
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                        <v-btn x-large block :disabled="!valid" color="success" @click="login">
                          Login
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-card>
    </v-layout>
    <v-layout align-center justify-center v-if="$store.state.userRole">
      <v-card>
        <v-card-title> You are already logged in! </v-card-title>
        <v-btn @click="$router.push('Home')">Click here to redirect</v-btn>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [{ name: "Login", icon: "mdi-account" }],
    valid: true,
    isLoading: false,
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    emailRules: [(v) => !!v || "Required", (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],

    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
    },
  }),
  computed: {
    passwordMatch() {
      return () => this.password === this.passwordConfirm || "Password must match";
    },
  },
  created() {},
  methods: {
    async login() {
      if (this.$refs.loginForm.validate()) {
        try {
          this.isLoading = true;
          let res = await axios.post(
            process.env.VUE_APP_API_URL + "/api/v1/users/login",
            {
              Email: this.loginEmail,
              Password: this.loginPassword,
            },
            {
              withCredentials: true,
            }
          );
          this.isLoading = false;
          if (res.data.status === "success") {
            this.$store.state.loggedIn = true;
            this.$store.state.userRole = res.data.data.UserRole;
            this.$store.state.userEmployeeReference = res.data.data.EmployeeReference;
            this.$store.state.userName = res.data.data.Name;
          }
          if (this.$store.state.userRole === "admin") {
            this.$router.push("workOrders");
          } else {
            this.$router.push("Home");
          }
        } catch (error) {
          this.isLoading = false;
          let payload = { type: "error" };
          if (error.response) {
            if (error.response.status === 401) {
              payload.message = error.response.data.message;
            }
          }
          this.$store.dispatch("snackBarAlert", payload);
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
