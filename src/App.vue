<template>
  <div class="w-full h-screen max-h-screen flex flex-col">
    <Header />
    <!-- <router-link to="/">Home</router-link> -->
    <router-view class="self-stretch flex-grow" />
    <transition name="snack">
      <app-snack v-if="snack.show" />
    </transition>
  </div>
</template>
<script lang="ts">
import Header from "@/components/TheHeader.vue";
import { defineAsyncComponent, defineComponent } from "vue";
import { mapGetters } from "vuex";
export default defineComponent({
  computed: {
    ...mapGetters({
      snack: "getSnack",
    }),
  },
  components: {
    Header,
    AppSnack: defineAsyncComponent(() => import("@/components/AppSnack.vue")),
  },
});
</script>
<style>
#app {
  font-family: "Source Sans Pro", Segoe UI, -apple-system, Roboto, "Noto Sans",
    Ubuntu, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.snack-enter-active {
  animation: snack 0.2s;
}
.snack-leave-active {
  animation: snack 0.2s reverse;
}
@keyframes snack {
  from {
    position: fixed;
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    position: fixed;
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
