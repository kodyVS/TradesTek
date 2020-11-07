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
    loggedIn: false,
    isError: false,
    errorMessage: "Error",
    isSuccess: false,
    successMessage: "Success",
    userRole: "",
    userEmployeeReference: "",
    userName: "",
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
        this.state.errorMessage = payload.message;
        this.state.isError = true;
      } else if (payload.type === "success") {
        this.state.isSuccess = true;
        this.state.successMessage = payload.message;
      }
    },
    getEmployees: async () => {
      let employees = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/employee/all", { withCredentials: true })
        .catch((error) => {
          if (error.response) {
            isError = true;
            errorMessage = error.response.data.message;
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return employees.data.data;
    },
    getEmployee: async (_, Id) => {
      let employee = await axios
        .get(process.env.VUE_APP_API_URL + `/api/v1/employee/${Id}`, { withCredentials: true })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return employee.data.employee;
    },
    async getCustomers() {
      let customers = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/customer/all", { withCredentials: true })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return customers.data.data;
    },
    async getJobs() {
      let jobs = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/job/all", { withCredentials: true })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return jobs.data.data;
    },
    async getAllActiveWorkOrders(_, filterParam) {
      let activeWorkOrders = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/allActive", {
          params: filterParam,
          withCredentials: true,
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return activeWorkOrders.data.data;
    },
    async getAllWorkOrders(_, filterParam) {
      let allWorkOrders = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/all", {
          params: filterParam,
          withCredentials: true,
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return allWorkOrders.data.data;
    },
    async getWorkOrder(_, params) {
      let workOrder = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/workOrder/" + params[0], {
          params: { TimePopulation: params[1] },
          withCredentials: true,
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
      return workOrder.data.data;
    },
    async getAllTimes(_, param) {
      let times = await axios
        .get(process.env.VUE_APP_API_URL + "/api/v1/time/all" + param, { withCredentials: true })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return times.data.data;
    },
    async editTime(_, editedTime) {
      let edittedTime = await axios
        .patch(process.env.VUE_APP_API_URL + "/api/v1/time/edit", editedTime, {
          withCredentials: true,
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return edittedTime;
    },
    async deleteTime(_, timeStamp) {
      let deletedTime = await axios
        .delete(process.env.VUE_APP_API_URL + "/api/v1/time/delete/" + timeStamp._id, {
          withCredentials: true,
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
        });
      return deletedTime;
    },
    async addTime(_, timeStamp) {
      let addedTime = await axios
        .post(process.env.VUE_APP_API_URL + "/api/v1/time/add/", timeStamp, {
          withCredentials: true,
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong! Check Network Connection");
          }
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
        });
    },
    async autoLogin() {
      if (!this.state.loggedIn) {
        await axios
          .get(process.env.VUE_APP_API_URL + "/api/v1/users/autoLogin", {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.status === "success") {
              this.state.loggedIn = true;
              this.state.userRole = res.data.data.UserRole;
              this.state.userEmployeeReference = res.data.data.EmployeeReference;
              this.state.userName = res.data.data.Name;
            }
          })
          .catch((error) => {
            this.state.loggedIn = false;
            this.state.userRole = "";
            if (error.response) {
              if (error.response.status !== 401) {
                console.log(error.response.data.message);
              }
            }
          });
      }
    },
  },
  modules: {},
});
