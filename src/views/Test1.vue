<template>
  <div>hello {{ events }}</div>
</template>

<script>
export default {
  data() {
    return {
      events: "",
    };
  },
  created() {
    this.getEvents();
  },
  methods: {
    async getEvents() {
      let events = [];
      console.log(this.employee.Name);
      events = await this.$store.dispatch("getAllTimes", this.employee.Name);
      this.events = events;
    },
  },
};
</script>
