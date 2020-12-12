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
  { path: "/:pathMatch(.*)*", name: "not-found", redirect: { name: "home" } },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {});

export default router;
