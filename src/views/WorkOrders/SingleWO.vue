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
            <v-card-subtitle>{{ workOrder.ParentRef.FullName }}</v-card-subtitle>
            <v-card-text>
              <h3>Email: {{ workOrder.Email }}</h3>
              <h3></h3>
              <h3>
                Contact Name:
                {{ `${workOrder.Salutation}. ${workOrder.FirstName} ${workOrder.LastName}` }}
              </h3>
              <h3>Phone: {{ workOrder.Phone }}</h3>
              <h3>
                Location:
                {{ workOrder.BillAddress ? workOrder.BillAddress.Addr1 : "" }}
              </h3>
            </v-card-text>

            <v-card-actions>
              <v-btn color="success">Click #1</v-btn>
              <v-btn color="primary" @click="editRoute()">Edit</v-btn>
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
      this.workOrder = await this.$store.dispatch("getJob", this.$route.params.id);
    },
    editRoute() {
      this.$store.state.item = this.workOrder;
      this.$router.replace({ name: "CreateWO" });
    },
  },
};
</script>
