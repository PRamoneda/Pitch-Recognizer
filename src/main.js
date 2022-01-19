import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/element";
import "@/assets/style/index.scss";
import "@/assets/style/atomic.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
