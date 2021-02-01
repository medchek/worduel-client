<template>
  <div id="shuffler" class="flex flex-col flex-grow w-full items-center">
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
        class="word text-5xl 2xl:text-7xl font-bold text-gray-800 rounded-md z-10 uppercase"
      >
        {{ word }}
      </div>
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
