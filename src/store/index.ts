import { createStore } from "vuex";
import UserInterfaceModule from "./modules/UI";
import Room from "./modules/Party";
import Party from "./modules/Room";

export default createStore({
  modules: {
    UserInterfaceModule,
    Room,
    Party,
  },
});
