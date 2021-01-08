import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "../store";
import Home from "@/views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/room/:id",
    name: "room",
    component: () => import("../views/Room.vue"),
    beforeEnter(to, from, next) {
      if (
        !store.getters.isPartyDataReceived &&
        !store.getters.isPartyDataReceived
      ) {
        // redirect back home
        console.log("isNotAllowedInRoomRoute");
        next({ name: "home" });
      } else next();
    },
  },
  {
    path: "/join/:roomId",
    name: "join",
    component: () => import("../views/Join.vue"),
  },
  { path: "/:pathMatch(.*)*", name: "not-found", redirect: { name: "home" } },
  // ! FOR DEVELOPMENT PHASE ONLY. MUST BE REMOVED AFTER COMPLETING THE TESTS
  {
    path: "/test",
    name: "test",
    component: () => import("../views/Room.vue"),
    beforeEnter() {
      console.warn(
        "This route is for testing purposes and should be removed before building for production!"
      );
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {});

export default router;
