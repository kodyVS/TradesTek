import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import dotenv from "dotenv";
import axios from "axios";
import VueCookie from "vue-cookie";
import VuetifyConfirm from "vuetify-confirm";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAHuBpqZBPv1G-ijSz5tWJp_2xsITp-Zk8",
  },
});

Vue.use(VueAwesomeSwiper);
Vue.use(VuetifyConfirm, { vuetify });
Vue.use(VueCookie);
dotenv.config();
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
new Vue({ router, store, vuetify, render: (h) => h(App) }).$mount("#app");
