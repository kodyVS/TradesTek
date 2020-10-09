import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify, {});
//Setting theme colors.

//todo add more colors and options for changing the colors
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
