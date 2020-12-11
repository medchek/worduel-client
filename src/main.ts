import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { WsClient } from "./ws/WsClient";

import "@/assets/tailwind.css";

createApp(App)
  .use(store)
  .use(router)
  .provide("ws", new WsClient(store))
  .mount("#app");
