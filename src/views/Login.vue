<template>
  <div>
    <v-layout justify-center align-center>
      <v-card v-model="dialog" class="mt-12">
        <div>
          <v-tabs
            v-model="tab"
            show-arrows
            background-color="primary darken-4"
            icons-and-text
            dark
            grow
          >
            <v-tabs-slider color="primary darken-4"></v-tabs-slider>
            <v-tab v-for="(tab, index) in tabs" :key="index">
              <v-icon large>{{ tab.icon }}</v-icon>
              <div class="caption py-1">{{ tab.name }}</div>
            </v-tab>
            <v-tab-item>
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
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="loginPassword"
                          :append-icon="show1 ? 'eye' : 'eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show1 ? 'text' : 'password'"
                          label="Password"
                          hint="At least 8 characters"
                          counter
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
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="registerForm" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="fullName"
                          :rules="[rules.required]"
                          label="First and Last Name"
                          maxlength="20"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="email"
                          :rules="emailRules"
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show1 ? 'text' : 'password'"
                          label="Password"
                          hint="At least 8 characters"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          block
                          v-model="passwordConfirm"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, passwordMatch]"
                          :type="show1 ? 'text' : 'password'"
                          label="Confirm Password"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-flex xs12 md5>
                        <v-combobox
                          v-model="userRole"
                          :items="['user', 'foreman', 'admin']"
                          label="Role"
                          outlined
                        ></v-combobox>
                      </v-flex>
                      <v-spacer></v-spacer>
                      <v-flex xs12 md6>
                        <v-autocomplete
                          v-model="employee"
                          :items="employees"
                          filled
                          clearable
                          label="Assign Employee"
                          item-text="Name"
                          item-value="_id"
                        ></v-autocomplete>
                      </v-flex>
                    </v-row>
                    <v-col cols="12" sm="3" xsm="12">
                      <v-btn x-large block :disabled="!valid" color="success" @click="signUp"
                        >Register</v-btn
                      >
                    </v-col>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
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
    tabs: [
      { name: "Login", icon: "mdi-account" },
      { name: "Register", icon: "mdi-account-outline" },
    ],
    valid: true,
    employee: {},
    employees: [],
    userRole: "user",
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
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
  created() {
    this.getEmployees();
  },
  methods: {
    async getEmployees() {
      this.employees = await this.$store.dispatch("getEmployees");
    },
    async signUp() {
      if (this.$refs.registerForm.validate()) {
        await axios
          .post(process.env.VUE_APP_API_URL + "/api/v1/users/signup", {
            Name: this.fullName,
            Email: this.email,
            //Photo: "",

            Password: this.password,
            PasswordConfirm: this.passwordConfirm,
            UserRole: this.userRole,
            EmployeeReference: this.employee,
          })
          .then(() => {
            this.$router.go("Dashboard");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async login() {
      if (this.$refs.loginForm.validate()) {
        await axios
          .post(
            process.env.VUE_APP_API_URL + "/api/v1/users/login",
            {
              Email: this.loginEmail,
              Password: this.loginPassword,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            //this.$cookie.set("jwt", response.data.token);
            this.$router.go("workOrders");
          })
          .catch((error) => {
            if (error.response !== 401) {
              alert("Something went wrong! Check Network Connection");
            }
          });
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
