<script>
//todo Add Shared data between table and list to send less requests
</script>
<template>
  <div>
    <v-flex xs12 md12>
      <v-row justify="center">
        <v-col cols="6" justify="center">
          <v-tabs fixed-tabs background-color="primary darken-2" dark hide-slider>
            <v-tab to="/TimeSheets/Calendar"> Calendar </v-tab>
            <v-tab to="/TimeSheets/List"> List </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-flex>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
