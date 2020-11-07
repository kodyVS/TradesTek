<script>
//New Features
//todo Make an option to pin the drawer the the side
</script>

<template>
  <!-- Top Navigation app bar -->
  <nav>
    <v-app-bar app fixed text color="primary" src="../../public\Images\NavBar.png">
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        :class="
          $vuetify.breakpoint.mdAndUp
            ? 'text-uppercase white--text'
            : 'text-uppercase font-size-10 white--text'
        "
      >
        <span class="font-weight-light">Trades</span>
        <span class="font-weight-black">Tek</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y v-if="$vuetify.breakpoint.mdAndUp">
        <template v-slot:activator="{ on }">
          <v-btn color="secondary" v-bind="size" v-on="on">
            <v-icon left>mdi-chevron-down</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list v-if="$store.state.loggedIn">
          <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        v-if="$store.state.loggedIn === true"
        color="grey lighten-4 black--text"
        v-bind="size"
        @click="logOut()"
      >
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
      <v-btn
        v-if="$store.state.loggedIn === false"
        color="grey lighten-4 black--text"
        @click="logIn()"
      >
        <span>Sign In</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Drawer side navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      class="secondary"
      temporary
      v-if="$store.state.loggedIn && $store.state.userRole"
    >
      <v-layout column align-center>
        <v-avatar size="70%" class="mt-12">
          <img src="../../public/Images/Geoffrey.jpg" alt />
        </v-avatar>
        <p class="white--text subheading mt-2">{{ $store.state.userName }}</p>

        <v-flex class="mt-4">
          <v-btn class="success" @click="$router.push('createWO')">New Work Order</v-btn>
        </v-flex>
      </v-layout>

      <!-- Lists on drawer -->

      <!-- Drop Down List -->
      <v-list class="mt-2">
        <v-list-group value="true" v-if="$store.state.userRole === 'admin'">
          <v-icon slot="appendIcon" class="white--text">mdi-chevron-down</v-icon>
          <template v-slot:activator>
            <v-icon class="white--text" left>mdi-folder</v-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Work Orders</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="link in dropDownLinks"
            :key="link.text"
            router
            :to="link.route"
            class="ml-2"
          >
            <v-icon class="white--text" left>{{ link.icon }}</v-icon>
            <v-list-item-title class="white--text">
              {{ link.text }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Static Lists -->
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-icon class="white--text" left>{{ link.icon }}</v-icon>
          <v-list-item-title class="white--text">
            {{ link.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-snackbar v-model="$store.state.isError" color="" class="success--text" top
      ><template v-slot:action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="$store.state.isError = false">
          Close
        </v-btn>
      </template>
      <v-icon color="red">mdi-alert-circle-outline</v-icon>
      <span> {{ $store.state.errorMessage }}</span>
    </v-snackbar>

    <v-snackbar v-model="$store.state.isSuccess" color="" class="success--text" top
      ><template v-slot:action="{ attrs }">
        <v-btn color="green" text v-bind="attrs" @click="$store.state.isSuccess = false">
          Close
        </v-btn>
      </template>
      <v-icon color="green">mdi-check</v-icon>
      <span> {{ $store.state.successMessage }}</span>
    </v-snackbar>
  </nav>
</template>

<script>
import Popup from "./Popup";
export default {
  components: { Popup },
  data() {
    return {
      //true or false for if the drawer is open
      drawer: false,
      isError: true,
      //Links for the drawer
      links: [],

      //Links for the dropdown folder which is set to be open atm
      dropDownLinks: [],
      mini: true,
    };
  },
  watch: {
    drawer: function () {
      if (this.drawer === true) this.getLinks();
    },
  },
  computed: {
    size() {
      const size = { xs: "small", sm: "medium", lg: "large", xl: "large" }[
        this.$vuetify.breakpoint.name
      ];
      return size ? { [size]: true } : {};
    },
  },

  methods: {
    async logOut() {
      await this.$store.dispatch("logOut");
      this.$router.go("/login");
    },
    logIn() {
      this.$router.go("/login");
    },
    getLinks() {
      if (this.$store.state.userRole === "admin") {
        this.links = [
          { icon: "mdi-view-dashboard", text: "Dashboard", route: "/" },
          { icon: "mdi-account-box", text: "Job Sites", route: "/Jobs" },
          { icon: "mdi-account-box", text: "Customers", route: "/Customers" },
          {
            icon: "mdi-clock-outline",
            text: "TimeManager",
            route: "/TimeManager",
          },
          { icon: "mdi-calendar", text: "Timesheets", route: "/TimeSheets/Calendar" },

          { icon: "mdi-account", text: "Employees", route: "/employees" },
          { icon: "mdi-folder", text: "Projects", route: "/projects" },
          { icon: "mdi-account", text: "Register New User", route: "/RegisterUser" },
        ];
        //Links for the dropdown folder which is set to be open atm
        this.dropDownLinks = [
          {
            icon: "mdi-folder-multiple-outline",
            text: "Overview",
            route: "/WorkOrders",
          },
          {
            icon: "mdi-text-box-plus-outline",
            text: "Create New",
            route: "/CreateWO",
          },
        ];
      }
      if (this.$store.state.userRole === "user") {
        this.dropDownLinks = [];
        this.links = [
          { icon: "mdi-account", text: "Home", route: "/Home" },
          { icon: "mdi-calendar", text: "Timesheets", route: "/TimeSheets/Calendar" },
        ];
      }
    },
  },
};
</script>

<style scoped>
.v-toolbar__title {
}
</style>
