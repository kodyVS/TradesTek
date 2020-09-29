/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    customerList: [],
    newJobData: {},
    itemInfo: {},
    item: null,
    employeeInfo: "",
  },
  getters: {
    // getCustomerNames: (state) => {
    // },
    getNewJobData: (state) => {
      return state.newJobData;
    },
  },
  mutations: {},
  actions: {
    getEmployees: async (state) => {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/employee/all")
        .then((response) => {
          return response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
    async getCustomers() {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/customer/all")
        .then((response) => {
          return response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
    async getJobs() {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/job/all")
        .then((response) => {
          return response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
    async getAllActiveWorkOrders() {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/allActive")
        .then((response) => {
          return response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
    async getAllWorkOrders() {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/all")
        .then((response) => {
          return response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
    async getJob(context, param) {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/job/" + param)
        .then((response) => {
          return response.data.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
  },
  modules: {},
});
