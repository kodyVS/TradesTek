<template>
  <v-app>
    <Navbar />
    <v-main class="main">
      <TransitionPage>
        <router-view />
      </TransitionPage>
    </v-main>
  </v-app>
</template>

<script>
import TransitionPage from "./transitions/TransitionPage.vue";
import Navbar from "@/components/Navbar";
//import cookie from "vue-cookies";
export default {
  name: "App",
  components: {
    Navbar,
    TransitionPage,
  },
  data: () => ({}),
  methods: {},
};
</script>
<style>
@media screen and (max-width: 700px) {
  .theme--light.v-data-table tbody td:first-child {
    border-top: 8px solid rgba(0, 0, 355, 0.7) !important;
  }
}
.v-main {
  padding-top: 80px !important;
}
.v-main__wrap {
  margin-bottom: 30px !important;
}
.main {
  background: #e4e4e4;
}
html {
  overflow-y: auto;
}
</style>
