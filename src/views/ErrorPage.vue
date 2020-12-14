<script>
//! Currently not used
</script>
<template>
  <div>
    <v-container class="pt-12">
      <v-row justify="center" align="center"> <h1>There was an Error!</h1> </v-row>
      <v-row justify="center" align="center">
        <v-btn class="mt-4 mb-4" @click="$router.go(-1)">Back</v-btn>
      </v-row>
      <v-row justify="center" align="center">
        {{ error }}
      </v-row>
    </v-container>

    <v-container>
      <v-card>
        <v-row>
          <h1>You are not authorized to be on this page</h1>
        </v-row>
        <v-btn @click="$router.go()">Back to home</v-btn>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: "",
    };
  },
};
</script>
