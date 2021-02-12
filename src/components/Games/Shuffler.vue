<template>
  <div
    id="shuffler"
    class="flex flex-col flex-grow w-full items-center relative"
  >
    <div
      class="flex flex-grow-0 items-center text-2xl xl:text-3xl 2xl:text-4xl h-14 text-gray-400"
      ref="wordSection"
    >
      Guess the shuffled word
    </div>
    <div class="flex items-center justify-center flex-grow w-full relative">
      <timer class="absolute" />
      <app-icon
        :icon="mdiCheck"
        :size="400"
        class="text-teal-500 opacity-10 absolute"
        v-if="playerFoundAnswer"
      />
      <div
        class="word text-5xl 2xl:text-7xl font-bold rounded-md z-10 uppercase"
        :class="hasFoundAnswer ? 'text-teal-500' : 'text-gray-800'"
      >
        {{ word }}
      </div>
    </div>

    <div
      id="round-status"
      class="flex items-center justify-between absolute w-2/3 text-gray-300 h-10 bottom-0 text-lg mb-10 font-bold"
    >
      <span>Round {{ currentRound }}/{{ roundCount }}</span>
      <span>Timer: {{ remainingTime }}s</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import Timer from "./Timer.vue";
import AppIcon from "@/components/AppIcon.vue";

import { mdiCheck } from "@mdi/js";

export default defineComponent({
  setup() {
    const store = useStore();
    return {
      word: computed(() => store.getters.getWord),
      playerFoundAnswer: computed(() => store.getters.getPlayerFoundAnswer),
      mdiCheck,
      currentRound: computed(() => store.getters.getCurrentRound),
      roundCount: computed(() => store.getters.getRoundCount),
      remainingTime: computed(() => store.getters.getCurrentTime),
      hasFoundAnswer: computed(() => store.getters.getPlayerFoundAnswer),
    };
  },
  components: {
    Timer,
    AppIcon,
  },
});
</script>
<style scoped>
.word {
  letter-spacing: 0.2em;
}
</style>
