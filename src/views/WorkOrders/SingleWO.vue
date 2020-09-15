<template>
  <div class="mt-6">
    <v-btn @click="$router.go(-1)">Back</v-btn>
    <v-container class="mt-12">
      <v-layout>
        <v-flex xs12 sm12>
          <v-card hover>
            <v-card-title>
              <h2>{{ workOrder.Name }}</h2>
            </v-card-title>

            <v-card-text>
              <h4>Email: {{ workOrder.Email }}</h4>
              <h4>Email: {{ workOrder.Email }}</h4>
              <h4>Email: {{ workOrder.Email }}</h4>
              <h4>Email: {{ workOrder.Email }}</h4>
              <h4>Email: {{ workOrder.Email }}</h4>
            </v-card-text>

            <v-card-actions>
              <v-btn color="success">Click #1</v-btn>
              <v-btn flat color="primary">Click #2</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>mdi-bookmark</v-icon></v-btn>
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
      workOrder: [],
    };
  },
  created() {
    this.getWorkOrder();
  },
  methods: {
    async getWorkOrder() {
      this.workOrder = await this.$store.dispatch(
        "getJob",
        this.$route.params.id
      );
    },
  },
};
</script>
