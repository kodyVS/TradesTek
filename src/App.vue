<template>
  <v-app>
    <Navbar />
    <v-main class="grey lighten-2">
      <v-main class="ml-4">
        <TransitionPage>
          <router-view />
        </TransitionPage>
      </v-main>
    </v-main>
  </v-app>
</template>

<script>
import TransitionPage from "./transitions/TransitionPage.vue";
import Navbar from "@/components/Navbar";
export default {
  name: "App",
  components: {
    Navbar,
    TransitionPage,
  },
  data: () => ({
    //
  }),
  mounted() {},
};
</script>
