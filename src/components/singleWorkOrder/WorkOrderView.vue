<template>
  <v-container fluid>
    <v-card hover v-if="workOrder.Job">
      <v-row class="ml-4" noGutters>
        <v-col md="12">
          <v-card-title>
            <h3>
              <i>{{ workOrder.Name }}</i>
            </h3>
            <v-chip v-if="!workOrder.Complete" class="ml-4 white--text" color="warning">
              - Active
            </v-chip>
            <v-chip v-if="workOrder.Complete" class="ml-4 white--text" color="success"
              >- Complete
            </v-chip>
          </v-card-title>
        </v-col>
      </v-row>
      <v-row class="ml-4">
        <v-col md="6">
          <p class="intro">{{ workOrder.Description }}</p>
        </v-col>
      </v-row>

      <v-card-text>
        <v-row noGutters>
          <v-col md="2">
            <h4 class="intro">Start Date</h4>
            <h3 class="dataText">
              {{ formattedStartDate }}
            </h3>
          </v-col>
          <v-col md="2">
            <h4>Expected End Date</h4>
            <h3 class="dataText">
              {{ formattedEndDate }}
            </h3>
          </v-col>
          <v-col md="2">
            <h4>PO Number</h4>
            <h3 class="dataText">
              {{ workOrder.PONumber }}
            </h3>
          </v-col>
        </v-row>
        <v-row class="mt-12 mb-1 ml-1">
          <h2 class="dataText">Customer Information</h2>
        </v-row>

        <v-row>
          <v-col md="1">
            <h4>Customer</h4>
            <h3 class="dataText">
              {{ workOrder.Job.ParentRef.FullName }}
            </h3>
          </v-col>

          <v-col md="1">
            <h4>Job Site</h4>
            <h3 class="dataText">
              {{ workOrder.Job.Name }}
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="2">
            <h4>Contact Name</h4>
            <h3 class="dataText">
              {{ `${workOrder.Job.FirstName + " " + workOrder.Job.LastName}` }}
            </h3>
          </v-col>

          <v-col md="2">
            <h4>
              <v-icon left>mdi-email</v-icon>
              <span>Email</span>
            </h4>
            <h3 class="dataText">{{ workOrder.Job.Email }}</h3>
          </v-col>
          <v-col md="2">
            <h4>
              <v-icon left>mdi-phone</v-icon>
              <span>Phone</span>
            </h4>
            <h3 class="dataText">{{ workOrder.Job.Phone }}</h3>
          </v-col>
        </v-row>

        <v-row noGutters class="mt-8">
          <v-col xs="12" md="12">
            <h4>
              <v-icon color="grey darken-2">mdi-map-marker </v-icon>
              <span> Location </span>
            </h4>
            <h4 class="ml-5 dataText">
              <span>{{ getAddressString }}</span>
            </h4>
          </v-col>

          <v-col>
            <v-btn
              small
              text
              text-align="center"
              color="success"
              :href="`https://www.google.com/maps/search/?api=1&query=${getAddressString}`"
              ><b>Open on google maps</b>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="ml-2 mt-4">
          <GmapMap :center="mapData" :zoom="14" style="width: 640px; height: 200px" ref="mapRef">
            <gmap-marker :position="mapData"> </gmap-marker
          ></GmapMap>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-if="$store.state.userRole === 'admin'" @click="editWorkOrder()"
          >Edit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  props: ["workOrder"],
  data() {
    return {
      mapData: {
        lat: 53.558647,
        lng: -113.3908279,
      },
    };
  },
  async created() {},
  watch: {
    workOrder: function () {
      this.getWOCoordinates();
    },
  },
  computed: {
    getAddressString: function () {
      return `${this.workOrder.Job.BillAddress.Addr1 ? this.workOrder.Job.BillAddress.Addr1 : ""} ${
        this.workOrder.Job.BillAddress.City ? this.workOrder.Job.BillAddress.City : ""
      } ${
        this.workOrder.Job.BillAddress.PostalCode ? this.workOrder.Job.BillAddress.PostalCode : ""
      }`;
    },
    formattedStartDate() {
      return this.workOrder.StartDate
        ? moment(this.workOrder.StartDate).format("MMMM Do YYYY")
        : "";
    },
    formattedEndDate() {
      return this.workOrder.EndDate ? moment(this.workOrder.EndDate).format("MMMM Do YYYY") : "";
    },
  },
  methods: {
    async getWOCoordinates() {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${this.getAddressString}&key=AIzaSyCu-ihS_KAjdBhAaPWaWML1rJzq6Adah5c`
        )
        .then((res) => {
          console.log(res);
          this.mapData = res.data.results[0].geometry.location;
        });
    },
  },
  editWorkOrder() {
    this.$store.state.item = this.workOrder;
    this.$router.replace({ name: "CreateWO" });
  },
  getAddressData() {
    console.log("hello");
  },
};
</script>
<style scoped>
.intro {
  color: grey;
}
.dataText {
  color: #383838;
}
</style>
