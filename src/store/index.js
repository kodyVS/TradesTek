/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    customerList: [
    ],
    itemInfo: {}
  },
  getters: {
    // getCustomerNames: (state) => {
    // },
    // getCustomers: async (state) => {
    //   let data = ''
    //   data = await axios.get(process.env.VUE_APP_API_URL + '/api/v1/customer/all')
    //     .then((response) => {
    //       console.log(response);
    //       return response.data
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });

    // },
  },
  mutations: {},
  actions: {},
  modules: {},
});
