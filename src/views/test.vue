<template>
  <div>
    <v-btn @click="showConfirm">Show confirm</v-btn>
    <v-btn @click="showError" color="info">Show error</v-btn>
    <v-btn @click="showWarning" color="warning">Show warning</v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    showConfirm() {
      this.$confirm("Lorem ipsum dolor sit amet, consectetur adipiscing elit,");
    },
    async showError() {
      let res = await this.$confirm("Lorem ipsum dolor sit amet, consectetur adipiscing elit,", {
        color: "error",
        title: "Error",
      });
      if (res) {
        console.log("success");
      }
    },
    showWarning() {
      this.$confirm("Lorem ipsum dolor sit amet, consectetur adipiscing elit,", {
        color: "warning",
        title: "Warning",
      });
    },
  },
};
</script>
