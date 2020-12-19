import { createStore, createLogger } from "vuex";
import UserInterfaceModule from "./modules/UI";
import Room from "./modules/Party";
import Party from "./modules/Room";

export default createStore({
  modules: {
    UserInterfaceModule,
    Room,
    Party,
  },
  plugins: process.env.NODE_ENV !== "production" ? [createLogger()] : [],
});
