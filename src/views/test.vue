<template>
  <div>
    <v-row justify="center">
      <!-- <v-btn-toggle dark v-model="currentView">
        <v-btn dark> List View </v-btn>-->
      <v-btn dark> Calendar View </v-btn>
      <!--</v-btn-toggle>-->
    </v-row>
    <vue-custom-scrollbar class="scroll-area" :settings="settings">
      <v-row>
        <v-col>
          <v-sheet width="3000">
            <v-toolbar flat>
              <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday"> Today </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-sheet>
          <v-sheet width="3000">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              type="category"
              category-show-all
              :categories="employeeNames"
              :event-color="getEventColor"
              :events="events"
              :interval-format="intervalFormat"
            ></v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </vue-custom-scrollbar>
  </div>
</template>
<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
export default {
  components: {
    vueCustomScrollbar,
  },
  data() {
    return {
      settings: {
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: false,
      },
    };
  },
  methods: {},
};
</script>
<style>
.scroll-area {
  position: relative;
  margin: auto;
  width: 1500px;
  height: 400px;
}
</style>
