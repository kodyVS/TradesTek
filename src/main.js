import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import dotenv from "dotenv";
import axios from "axios";
import VueCookie from "vue-cookie";

Vue.use(VueCookie);
dotenv.config();
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
new Vue({ router, store, vuetify, render: (h) => h(App) }).$mount("#app");
