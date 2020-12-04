<script></script>
<template>
  <v-container fluid>
    <ImageSwiper v-if="workOrder.Job" :workOrder="workOrder"></ImageSwiper>
    <workOrderView v-if="workOrder.Job" :workOrder="workOrder"></workOrderView>
    <TimeData v-if="workOrder.Job" :workOrder="workOrder"></TimeData>
  </v-container>
</template>
<script>
import WorkOrderView from "../../components/singleWorkOrder/WorkOrderView";
import ImageSwiper from "../../components/singleWorkOrder/ImageSwiper";
import TimeData from "../../components/singleWorkOrder/TimeData";
export default {
  components: {
    WorkOrderView,
    ImageSwiper,
    TimeData,
  },
  props: ["selectedWO"],
  data() {
    return {
      //other
      workOrder: {
        Name: "",
        Job: {
          FirstName: "",
          LastName: "",
          Phone: "",
          Email: "",
          ParentRef: {
            FullName: "",
            ListID: "",
          },
          BillAddress: {
            Addr1: " ",
            City: " ",
            PostalCode: "",
          },
        },
        JobType: "",
        Employees: [],
        Description: "",
        ListID: "",
        EditSequence: "",
        Complete: "",
        TimeReference: [],
      },
    };
  },
  //at create call getWorkOrders
  created() {
    this.getWorkOrder();
  },
  methods: {
    //Call get work order from the database
    async getWorkOrder() {
      if (!this.selectedWO) {
        this.workOrder = await this.$store.dispatch("getWorkOrder", [this.$route.params.id]);
      } else {
        this.workOrder = this.selectedWO;
      }
    },
  },
};
</script>

<style scoped></style>
