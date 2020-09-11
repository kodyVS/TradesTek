<template>
  <nav>
    <v-app-bar text color="primary" src="../../public\Images\NavBar.png">
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase white--text">
        <span class="font-weight-light">Trades</span>
        <span class="font-weight-black">Tek</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="secondary" v-on="on">
            <v-icon left>mdi-chevron-down</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn color="grey lighten-4 black--text">
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Drawer -->

    <v-navigation-drawer v-model="drawer" app class="secondary" temporary>
      <v-layout column align-center>
        <v-flex class="mt-12">
          <v-avatar size="100">
            <img src="../../public/Images/Geoffrey.jpg" alt />
          </v-avatar>
          <p class="white--text subheading mt-1">Geoffrey Hostsman</p>
        </v-flex>
        <v-flex class="mt-4">
          <Popup />
        </v-flex>
      </v-layout>

      <!-- Lists -->

      <!-- Drop Down List -->
      <v-list class="mt-2">
        <v-list-group>
          <v-icon slot="appendIcon" class="white--text"
            >mdi-chevron-down</v-icon
          >
          <template v-slot:activator>
            <v-icon class="white--text" left>mdi-folder</v-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text"
                >Work Orders</v-list-item-title
              >
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
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-icon class="white--text" left>{{ link.icon }}</v-icon>
          <v-list-item-title class="white--text">
            {{ link.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Popup from "./Popup";
export default {
  components: { Popup },
  data() {
    return {
      drawer: false,
      links: [
        { icon: "mdi-view-dashboard", text: "Dashboard", route: "/" },
        { icon: "mdi-folder", text: "Projects", route: "/projects" },
        { icon: "mdi-account-box", text: "Customers", route: "/Customers" },
        { icon: "mdi-account", text: "Team", route: "/team" },
        { icon: "mdi-account", text: "Test", route: "/test1" },
      ],
      dropDownLinks: [
        {
          icon: "mdi-folder-multiple-outline",
          text: "Overview",
          route: "/OverviewWO",
        },
        {
          icon: "mdi-text-box-plus-outline",
          text: "Create New",
          route: "/CreateWO",
        },
      ],
      mini: true,
    };
  },
};
</script>
