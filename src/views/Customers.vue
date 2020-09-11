/* eslint-disable */
<template>
  <div class="mt-12">
    <Table />
  </div>
</template>
<script>
import Table from "./TableOne.vue";
export default {
  components: { Table },
  data() {
    return {
      customerNames: [],
      items: [],
      search: "",
      showExpand: false,
      headers: [
        {
          text: "Company Name",
          align: "start",
          value: "FullName"
        },
        { text: "Email", value: "Email" },
        { text: "Phone", value: "Phone" },
        { text: "Actions", value: "Actions" }
      ]
    };
  },
  methods: {
    showExpandMethod() {
      this.showExpand = !this.showExpand;
    }
  },

  created: function() {
    this.items = this.$store.state.customerList;
  }
};
</script>
