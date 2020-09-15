<template>
  <div class="team">
    <h1>Team</h1>
    <v-container class="my-5">
      <v-layout wrap>
        <v-flex
          v-for="(person, index) in team"
          :key="person.Name"
          xs12
          sm12
          md6
          lg4
        >
          <v-card class="text-left ma-3">
            <v-responsive class="pt-2 pb-2 secondary white--text">
              <span class="pa-3">{{ person.Name }}</span>
            </v-responsive>
            <v-card-text class="secondary--text">
              <v-text-field
                v-model="person.Phone"
                label="Phone"
                :readonly="readOnly !== index"
                dense
                append-icon="mdi-phone"
                @click:append="show = !show"
              ></v-text-field>
              <v-text-field
                v-model="person.Email"
                label="Email"
                :readonly="readOnly !== index"
                dense
                append-icon="mdi-email"
                @click:append="show = !show"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="grey lighten-2">
              <v-btn
                small
                text
                color="secondary"
                class="success ml-4"
                @click="createWO(person.Name)"
              >
                <v-icon small left color="white">mdi-folder</v-icon>
                <span class="white--text">Create WO</span>
              </v-btn>
              <v-btn
                small
                @click="
                  selectedIndex === index
                    ? (selectedIndex = null)
                    : (selectedIndex = index)
                "
              >
                Active Jobs
                <v-icon>{{
                  selectedIndex === index
                    ? "mdi-chevron-up"
                    : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>
              <v-btn
                v-if="readOnly !== index"
                disabled
                small
                class="ml-2 warning"
                @click="readOnly = index"
                >Edit</v-btn
              >
              <v-btn
                v-if="readOnly === index"
                small
                class="ml-2 success"
                @click="readOnly = true"
                >Save</v-btn
              >
            </v-card-actions>
            <v-expand-transition>
              <div v-show="index === selectedIndex">
                <v-divider></v-divider>
                <v-card-text> This is where active jobs go </v-card-text>
                <v-row justify="end" class="mr-2">
                  <v-btn small class="warning mb-2">Add Job</v-btn>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      team: [],
      selectedIndex: null,
      readOnly: true,
    };
  },
  created() {
    this.getEmployees();
  },
  methods: {
    async getEmployees() {
      console.log("getting employees");
      await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/employee/all")
        .then((response) => {
          this.team = response.data.data;
          console.log(this.team);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //Need to add functionality to push name when clicked to list of employees on the work order
    createWO(currentPerson) {
      // this.$store.state.itemInfo = `${}`currentPerson;
      this.$router.push("CreateWO");
      console.log(currentPerson);
    },
  },
};
</script>
