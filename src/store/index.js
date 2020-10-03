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
      try {
        let data = await axios
          .get(process.env.VUE_APP_API_URL + "/api/v1/employee/all")
          .then((response) => {
            return response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        return data;
      } catch (err) {}
    },
    async getCustomers() {
      try {
        let data = await axios
          .get(process.env.VUE_APP_API_URL + "/api/v1/customer/all")
          .then((response) => {
            return response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        return data;
      } catch (err) {}
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
      try {
        let data = await axios
          .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/allActive")
          .then((response) => {
            return response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        return data;
      } catch (err) {
        console.log(err);
      }
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
    async getWorkOrder(context, param) {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/" + param)
        .then((response) => {
          return response.data.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
    async getAllTimes(context, param) {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/time/all" + param)
        .then((response) => {
          return response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      return data;
    },
    async editTime(context, editedTime) {
      let data = await axios
        .patch(process.env.VUE_APP_API_URL + "/api/v1/time/edit", editedTime)
        .then((response) => {
          return response;
        });
      return data;
    },
    async deleteTime(context, timeStamp) {
      let data = await axios
        .delete(process.env.VUE_APP_API_URL + "/api/v1/time/delete/" + timeStamp._id)
        .then((response) => {
          return response;
        });
      console.log(data);
      return data;
    },
    async addTime(context, timeStamp) {
      let data = await axios
        .post(process.env.VUE_APP_API_URL + "/api/v1/time/add/", timeStamp)
        .then((res) => res);
      return data;
    },
  },
  modules: {},
});
