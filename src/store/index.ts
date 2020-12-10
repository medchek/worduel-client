import { createStore } from "vuex";
import UserInterfaceModule from "./modules/UserInterface";
import WsModule from "./modules/WsModule";

export default createStore({
  modules: {
    UserInterfaceModule,
    WsModule,
  },
});
