<template>
  <v-app>
    <Navbar />
    <v-main class="grey lighten-2">
      <v-main class="ml-4">
        <router-view></router-view>
      </v-main>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  name: "App",
  components: {
    Navbar
  },
  mounted() {},
  data: () => ({
    //
  })
};
</script>
