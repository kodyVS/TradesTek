<template>
  <div class="team">
    <h1>team</h1>
    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="person in team" :key="person.name">
          <v-card text class="text-center ma-3">
            <v-responsive class="pt-4">
              <span>{{ person.name }}</span>
            </v-responsive>
            <v-card-text>
              <div class="grey--text">{{ person.role }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn small text color="grey">
                <v-icon small left>mdi-folder</v-icon>
                <span>Active Jobs</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      team: [
        { name: "Bob Frank", role: "Plumber" },
        { name: "Ryu Lois", role: "Plumber" },
        { name: "Chun Li", role: "HVAC Tech" },
        { name: "Gordon Li", role: "HVAC Tech" },
        { name: "Shamus Murphy", role: "Plumber" }
      ]
    };
  }
};
</script>
{ title: 'Kurcher project', person: '', due: '1st Jan 2019', status: 'ongoing',
content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim
explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi
animi!'}, { title: 'Befesda project', person: '', due: '10th Jan 2019', status:
'complete', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.
Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia
enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non
sequi animi!'}, { title: 'Matolok', person: '', due: '20th Dec 2018', status:
'complete', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.
Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia
enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non
sequi animi!'}, { title: 'Semi Witches', person: '',
