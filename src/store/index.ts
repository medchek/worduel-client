import { createStore, createLogger } from "vuex";
import UserInterfaceModule from "./modules/UI";
import Room from "./modules/Party";
import Party from "./modules/Room";
import Chat from "./modules/Chat";
import Riddles from "./modules/games/Riddles";

export default createStore({
  modules: {
    UserInterfaceModule,
    Room,
    Party,
    Chat,
    Riddles,
  },
  actions: {
    /** Reset the whole store to its default state*/
    resetStore({ commit }): void {
      commit("RESET_ALL_PARTY");
      commit("RESET_ALL_UI");
      commit("RESET_ALL_ROOM");
      commit("RESET_ALL_CHAT");
    },
  },
  plugins: process.env.NODE_ENV !== "production" ? [createLogger()] : [],
});
