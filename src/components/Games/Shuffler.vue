<template>
  <div
    id="shuffler"
    class="flex flex-col flex-grow w-full h-full items-center relative"
  >
    <div
      class="flex items-center text-lg sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl h-6 md:h-14 xl:h-16 text-gray-400 opacity-70"
      ref="wordSection"
    >
      Guess the shuffled word
    </div>
    <div
      id="shuffled-word-container"
      class="flex items-center justify-center flex-col md:flex-row flex-grow w-full relative"
    >
      <timer-circle
        class="hidden md:block absolute w-auto h-full md:w-9/10 md:h-full stroke-5 lg:stroke-10"
      />
      <app-icon
        :icon="mdiCheck"
        :size="400"
        className="text-teal-500 opacity-40 md:opacity-20 absolute h-40 w-40 sm:w-52 sm:h-52 md:w-80 md:h-80 2xl:w-96 2xl:h-96"
        v-if="playerFoundAnswer"
      />
      <!-- v-if="playerFoundAnswer" -->
      <div
        class="flex justify-center items-center word w-full h-full md:h-12 md:bg-transparent bg-opacity-50 text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold rounded-md z-10 uppercase bg-white"
        :class="playerFoundAnswer ? 'text-teal-500' : 'text-gray-800'"
      >
        {{ word }}
      </div>
      <timer-bar class="h-6 w-full text-lg md:hidden" />
    </div>
    <!-- <div
      id="round-status"
      class="flex items-center justify-between md:w-2/3 text-gray-400 md:h-10 bottom-0 text-sm md:text-base xl:text-lg  font-bold "
    >
      <span>Round {{ currentRound }}/{{ roundCount }}</span>
      <span>Timer: {{ remainingTime }}s</span>
    </div> -->
    <game-meta-data
      class="w-full md:w-2/3 text-gray-400 md:h-10 p-2 md:mb-10 text-sm md:text-base xl:text-lg"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import TimerCircle from "./TimerRadial.vue";
import TimerBar from "./TimerBar.vue";
import AppIcon from "@/components/AppIcon.vue";
import GameMetaData from "@/components/Games/GameMetaData.vue";

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
    };
  },
  components: {
    TimerCircle,
    TimerBar,
    AppIcon,
    GameMetaData,
  },
});
</script>
<style scoped>
.word {
  letter-spacing: 0.2em;
}
</style>
