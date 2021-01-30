import { createStore, createLogger } from "vuex";
import UserInterfaceModule from "./modules/UI";
import Room from "./modules/Party";
import Party from "./modules/Room";
import Chat from "./modules/Chat";

export default createStore({
  modules: {
    UserInterfaceModule,
    Room,
    Party,
    Chat,
  },
  plugins: process.env.NODE_ENV !== "production" ? [createLogger()] : [],
});
