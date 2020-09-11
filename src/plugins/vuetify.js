import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify, {});
export default new Vuetify({
  iconfont: "md",
  theme: {
    themes: {
      light: {
        primary: "#224EDC",
        secondary: "#252525",
        success: "#3EAB2A",
        info: "#F3D357",
        error: "#B22C1A",
      },
    },
  },
});
