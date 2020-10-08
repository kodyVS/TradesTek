<template>
  <div>
    <v-container class="pt-12">
      <v-row justify="center" align="center"> <h1>There was an Error!</h1> </v-row>
      <v-row justify="center" align="center">
        <v-btn class="mt-4 mb-4" @click="$router.push('/')">Back to Dashboard</v-btn>
      </v-row>
      <v-row justify="center" align="center">
        {{ error }}
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: this.$store.state.error,
    };
  },
};
</script>
