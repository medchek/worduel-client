<template>
  <!-- <div class="w-full flex items-stretch my-3 px-2 justify-between"> -->
  <div
    class="w-full flex flex-col md:flex-row items-stretch justify-between md:p-2"
  >
    <!-- <transition name="slide"> -->
    <party />
    <!-- </transition> -->
    <section class="flex flex-col items-center flex-grow transition-all">
      <transition name="scale" mode="out-in">
        <component :is="roomComponent" />
      </transition>
    </section>
    <chat />
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineAsyncComponent, defineComponent } from "vue";

import Party from "@/components/Party/Party.vue";
import Chat from "@/components/Chat/Chat.vue";
import RoundAnnouncer from "@/components/Games/RoundAnnouncer.vue";
import ScoreAnnouncer from "@/components/Games/ScoreAnnouncer.vue";
import GameLoader from "@/components/Games/GameLoader.vue";

export default defineComponent({
  setup() {
    const store = useStore();
    const roomComponent = computed(() => store.getters.getRoomComponent);
    return { roomComponent };
  },
  components: {
    Party,
    Chat,
    RoundAnnouncer,
    ScoreAnnouncer,
    WordSelector: defineAsyncComponent({
      loader: () => import("@/components/Games/WordSelector.vue"),
      loadingComponent: GameLoader,
    }),
    Shuffler: defineAsyncComponent({
      loader: () => import("@/components/Games/Shuffler.vue"),
      loadingComponent: GameLoader,
    }),
    Riddles: defineAsyncComponent({
      loader: () => import("@/components/Games/Riddles.vue"),
      loadingComponent: GameLoader,
    }),
    Guess: defineAsyncComponent({
      loader: () => import("@/components/Games/Guess.vue"),
      loadingComponent: GameLoader,
    }),
    TurnAnnouncer: defineAsyncComponent({
      loader: () => import("@/components/Games/TurnAnnouncer.vue"),
      loadingComponent: GameLoader,
    }),
  },
});
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  /* transform: scale(0); */
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
}

.slide-enter-active,
.scale-leave-active {
  /* transform: scale(0); */
  opacity: 1;
  transition: all 0.3s ease;
}

.slide-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
