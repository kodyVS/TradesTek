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
          value: "FullName",
        },
        { text: "Email", value: "Email" },
        { text: "Phone", value: "Phone" },
        { text: "Actions", value: "Actions" },
      ],
    };
  },

  created: function () {
    this.items = this.$store.state.customerList;
  },
  methods: {
    showExpandMethod() {
      this.showExpand = !this.showExpand;
    },
  },
};
</script>
