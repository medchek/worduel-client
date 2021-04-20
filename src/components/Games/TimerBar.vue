<template>
  <div
    id="progress-timer-base"
    class="flex flex-col justify-center mt-auto w-full h-4 md:h-6 2xl:h-8 bg-gray-300 relative rounded-b-md overflow-hidden"
  >
    <div
      id="progress-timer-backgournd"
      class="absolute w-full text-xl 2xl:text-2xl text-white z-10 text-center"
    >
      {{ currentTime }}s
    </div>
    <div
      id="progress-timer-overlay"
      :style="{ width: progress }"
      class="h-full bg-gradient-to-r from-teal-300 to-teal-500 absolute transition-all"
    ></div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    //
    const store = useStore();
    const timePerTurn = computed(() => store.getters.getTimePerRound);
    const currentTime = computed(() => store.getters.getCurrentTime);

    const progress = computed(() => {
      return (currentTime.value * 100) / timePerTurn.value + "%";
    });

    return {
      progress,
      currentTime,
    };
  },
});
</script>
