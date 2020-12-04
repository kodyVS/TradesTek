<script>
//todo Add Shared data between table and list to send less requests
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-flex xs12 md6>
        <v-tabs fixed-tabs background-color="primary darken-2" dark hide-slider>
          <v-tab to="/TimeSheets/Calendar"> Calendar </v-tab>
          <v-tab to="/TimeSheets/List"> List </v-tab>
        </v-tabs>
      </v-flex>
    </v-row>

    <router-view></router-view>
  </v-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
