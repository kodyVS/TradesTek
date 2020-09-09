<template>
  <div class="home">
    <h1>Dashboard</h1>
    <v-container class="my-5">
      <v-layout justify-start class="mb-3">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text @click="sortBy('title')" v-on="on">
              <v-icon left small>mdi-folder</v-icon>
              <span right class="caption text-lowercase">by project name</span>
            </v-btn>
          </template>
          <span>Sort projects by name</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text @click="sortBy('person')" v-on="on">
              <v-icon small left>mdi-account</v-icon>
              <span class="caption text-lowercase">By Person</span>
            </v-btn>
          </template>
          <span>Sort projects by person</span>
        </v-tooltip>
      </v-layout>

      <v-card text v-for="project in projects" :key="project.title">
        <v-layout wrap :class="`pa-3 project ${project.status}`">
          <v-flex xs12 md6>
            <div class="caption grey--text">Project Title</div>
            <div>{{ project.title }}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Person</div>
            <div>{{ project.person }}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Due By</div>
            <div>{{ project.due }}</div>
          </v-flex>
          <v-flex xs2 sm4 md2>
            <div class="text-right">
              <v-chip
                small
                :class="
                  `${project.status} white--text font-weight-medium caption my-2 text-md`
                "
                >{{ project.status }}</v-chip
              >
            </div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [
        {
          title: "Kurcher project",
          person: "Bob Frank",
          due: "1st Jan 2019",
          status: "ongoing",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!"
        },
        {
          title: "Befesda project",
          person: "Chun Li",
          due: "10th Jan 2019",
          status: "complete",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!"
        },
        {
          title: "Matolok",
          person: "Ryu Lois",
          due: "20th Dec 2018",
          status: "complete",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!"
        },
        {
          title: "Semi Witches",
          person: "Gordon Li",
          due: "20th Oct 2018",
          status: "overdue",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!"
        }
      ]
    };
  },
  methods: {
    sortBy(prop) {
      this.projects.sort((a, b) => {
        return a[prop] < b[prop] ? -1 : 1;
      });
    }
  }
};
</script>

<style>
.project.complete {
  border-left: 4px solid #40b63c;
}
.project.ongoing {
  border-left: 4px solid #ffaa2c;
}
.project.overdue {
  border-left: 4px solid #f81f72;
}
.v-chip.complete {
  background: #32af5c !important;
}
.v-chip.ongoing {
  background: #ffaa2c !important;
}
.v-chip.overdue {
  background: #f81f3c !important;
}
</style>
