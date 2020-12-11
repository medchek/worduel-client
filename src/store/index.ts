import { createStore } from "vuex";
import UserInterfaceModule from "./modules/UserInterface";

export default createStore({
  modules: {
    UserInterfaceModule,
  },
});
