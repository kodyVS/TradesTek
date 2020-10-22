<template>
  <v-app>
    <Navbar />
    <v-main class="grey lighten-2">
      <v-main class="ml-4">
        <TransitionPage>
          <router-view v-if="$store.state.loggedIn && $store.state.userRole === 'admin'" />
        </TransitionPage>
        <TimeManager v-if="$store.state.loggedIn && $store.state.userRole === 'user'"></TimeManager>
        <Login v-if="!$store.state.loggedIn" />
      </v-main>
    </v-main>
  </v-app>
</template>

<script>
import TimeManager from "./views/UserViews/TimeManager.vue";
import TransitionPage from "./transitions/TransitionPage.vue";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Login from "./views/Login.vue";
//import cookie from "vue-cookies";
export default {
  name: "App",
  components: {
    Navbar,
    TransitionPage,
    Login,
    TimeManager,
  },
  data: () => ({}),
  methods: {
    async autoLogin() {
      await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/users/autoLogin", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.status === "success") {
            this.$store.state.loggedIn = true;
            this.$store.state.userRole = res.data.data.UserRole;
          }
        })
        .catch((error) => {
          this.$store.state.loggedIn = false;
          if (error.response) {
            if (error.response.status !== 401) {
              console.log(error.response.data.message);
            }
          }
        });
    },
  },
  created() {
    this.autoLogin();
  },
};
</script>
