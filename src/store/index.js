/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    customerList: [],
    newJobData: {},
    itemInfo: {},
    item: null,
    employeeInfo: "",
    error: null,
    loggedIn: "false",
    user: "",
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
        .get(process.env.VUE_APP_API_URL + "/api/v1/employee/all", { withCredentials: true })
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async getCustomers() {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/customer/all", { withCredentials: true })
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async getJobs() {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/job/all", { withCredentials: true })
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async getAllActiveWorkOrders() {
      try {
        let data = await axios
          .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/allActive", {
            withCredentials: true,
          })
          .then((response) => {
            return response.data.data;
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response);
              alert(error.response.data.message);
            } else {
              alert("Something went wrong! Check Network Connection");
            }
          });
        return data;
      } catch (err) {}
    },
    async getAllWorkOrders() {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/all", { withCredentials: true })
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async getWorkOrder(context, param) {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/" + param, { withCredentials: true })
        .then((response) => {
          return response.data.data.data;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
            router.go(-1);
            this.state.error = error.response.data;
          } else {
            alert("Something went wrong!");
            router.go(-1);
          }
        });
      return data;
    },
    async getAllTimes(context, param) {
      let data = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/time/all" + param, { withCredentials: true })
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async editTime(context, editedTime) {
      let data = await axios
        .patch(process.env.VUE_APP_API_URL + "/api/v1/time/edit", editedTime, {
          withCredentials: true,
        })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async deleteTime(context, timeStamp) {
      let data = await axios
        .delete(process.env.VUE_APP_API_URL + "/api/v1/time/delete/" + timeStamp._id, {
          withCredentials: true,
        })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async addTime(context, timeStamp) {
      let data = await axios
        .post(process.env.VUE_APP_API_URL + "/api/v1/time/add/", timeStamp, {
          withCredentials: true,
        })
        .then((res) => res)
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return data;
    },
    async logOut() {
      await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/users/logout", {
          withCredentials: true,
        })
        .then(() => {
          this.state.loggedIn = false;
        });
    },
  },
  modules: {},
});
