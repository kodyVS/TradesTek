/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //todo Move items out of state and into props
    //Data for new pages
    customerList: [],
    newJobData: {},
    itemInfo: {},
    item: null,
    employeeInfo: "",

    //Authenication data
    loggedIn: false,
    userRole: "",
    userEmployeeReference: "",
    userName: "",
    //Error handling with snackbars
    isError: false,
    errorMessage: "Error",
    isSuccess: false,
    successMessage: "Success",

    //Global settings
    settings: {},
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
    snackBarAlert(context, payload) {
      if (payload.type === "error") {
        if (payload.message) {
          this.state.errorMessage = payload.message;
        } else {
          this.state.errorMessage = "Something Went Wrong Check Internet Connection";
        }
        this.state.isError = true;
      } else if (payload.type === "success") {
        this.state.isSuccess = true;
        this.state.successMessage = payload.message;
      }
    },
    getEmployees: async (context, param) => {
      let showHidden = false;
      if (param) {
        showHidden = param;
      }
      let employees = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/employee/all", {
          params: { ShowHidden: showHidden },
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return employees.data.data;
    },
    getEmployee: async (context, Id) => {
      let employee = await axios
        .get(process.env.VUE_APP_API_URL + `/api/v1/employee/${Id}`, { withCredentials: true })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return employee.data.employee;
    },
    async getCustomers(context, filter) {
      let ShowHidden = false;
      if (filter) {
        ShowHidden = true;
      }
      let customers = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/customer/all", {
          params: { ShowHidden },
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return customers.data.data;
    },
    async getJobs(context, filter) {
      let jobs = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/job/all", {
          params: { ShowHidden: filter },
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return jobs.data.data;
    },
    async getAllActiveWorkOrders(context, filterParam) {
      let activeWorkOrders = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/allActive", {
          params: filterParam,
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return activeWorkOrders.data.data;
    },
    async getAllWorkOrders(context, filterParam) {
      let allWorkOrders = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/all", {
          params: filterParam,
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });

      return allWorkOrders.data.data;
    },
    async getWorkOrder(context, params) {
      let workOrder = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/" + params[0], {
          params: { TimePopulation: params[1] },
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return workOrder.data.data;
    },
    async getAllTimes(context, param) {
      let times = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/time/all" + param, { withCredentials: true })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return times.data.data;
    },
    async editTime(context, editedTime) {
      let edittedTime = await axios
        .patch(process.env.VUE_APP_API_URL + "/api/v1/time/edit", editedTime, {
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return edittedTime;
    },
    async deleteTime(context, timeStamp) {
      let deletedTime = await axios
        .delete(process.env.VUE_APP_API_URL + "/api/v1/time/delete", {
          params: { id: timeStamp._id, WOReference: timeStamp.WOReference },
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return deletedTime;
    },
    async addTime(context, timeStamp) {
      let addedTime = await axios
        .post(process.env.VUE_APP_API_URL + "/api/v1/time/add/", timeStamp, {
          withCredentials: true,
        })
        .catch((error) => {
          let payload = {
            type: "error",
          };
          if (error.response) {
            payload.message = error.response.data.message;
          }
          context.dispatch("snackBarAlert", payload);
        });
      return addedTime;
    },
    async logOut() {
      await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/users/logout", {
          withCredentials: true,
        })
        .then(() => {
          this.state.loggedIn = false;
          this.state.userRole = "";
          this.state.userEmployeeReference = "";
          this.state.userName = "";
          this.state.settings = "";
        });
    },
    async autoLogin(context) {
      if (!this.state.loggedIn) {
        await axios
          .get(process.env.VUE_APP_API_URL + "/api/v1/users/autoLogin", {
            withCredentials: true,
          })
          .then(async (res) => {
            if (res.data.status === "success") {
              this.state.loggedIn = true;
              this.state.userRole = res.data.data.UserRole;
              this.state.userEmployeeReference = res.data.data.EmployeeReference;
              this.state.userPhoto = res.data.data.Photo;
              this.state.userName = res.data.data.Name;
              this.state.settings = res.data.data.Settings;
            }
          })
          .catch((error) => {
            this.state.loggedIn = false;
            this.state.userEmployeeReference = "";
            this.state.userName = "";
            this.state.userRole = "";
          });
      }
    },
    async getSettings(context) {
      let settings = await axios.get(process.env.VUE_APP_API_URL + "/api/v1/settings/all", {
        withCredentials: true,
      });
      context.state.settings = settings.data.data;
      return settings.data.data;
    },
    async editSettings(context, payload) {
      let settings = await axios.post(
        process.env.VUE_APP_API_URL + "/api/v1/settings/edit",
        payload,
        {
          params: { id: payload._id },
          withCredentials: true,
        }
      );
      return settings.data.data;
    },
  },
  modules: {},
});
