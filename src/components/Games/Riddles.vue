<template>
  <div
    id="riddles"
    class="flex flex-col justify-center items-center flex-grow w-2/3 relative"
  >
    <!-- RIDDLE SECTION -->
    <section
      id="riddles-base"
      class="flex flex-col justify-center items-center w-full"
    >
      <!-- HEADER -->

      <h1 class="text-gray-300 text-xl xl:text-2xl 2xl:text-3xl text-center">
        Try to find the answer to the following riddle
      </h1>

      <!-- WORD DASHES -->
      <div
        id="word-to-guess"
        class="text-gray-700 h-20 my-2 text-3xl xl:text-5xl 2xl:text-6xl font-bold tracking-wider text-center flex items-center justify-center rounded"
      >
        <span v-if="riddleAnswer"> {{ riddleAnswer }}</span>
        <span v-else>
          {{ "-".repeat(riddleAnswerLen) }}
        </span>
      </div>

      <div id="riddles-box" class="flex flex-col rounded-lg w-full">
        <!-- RIDDLE DISPLAY -->
        <div
          class="flex justify-center items-center h-72 text-gray-800 font-bold text-center px-20 flex-grow-0 relative"
          :class="[
            playerFoundAnswer
              ? 'rounded-lg bg-gradient-to-b from-bgray-100 to-teal-50'
              : 'rounded-t bg-bgray-100',
          ]"
        >
          <app-icon
            :icon="mdiCheck"
            :size="300"
            class="text-teal-500 opacity-20 absolute"
            v-if="playerFoundAnswer"
          />
          <p
            class="absolute px-1 md:px-4 lg:px-10 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl antialiased"
          >
            {{ riddle }}
          </p>
        </div>
        <!-- PROGRESS TIMER -->
        <timer-bar v-if="!playerFoundAnswer" />
        <section
          class="flex flex-row justify-between px-2 text-sm sm:text-base md:text-lg font-bold text-gray-50 my-5 bg-bgray-400 rounded"
        >
          <div>round {{ currentRound }}/6</div>
          <div>
            <span v-if="remainingTimeBeforeEnd == -1">
              {{ currentTime }}s
            </span>
            <span v-else title="time remaining before the round ends">
              ending in: {{ remainingTimeBeforeEnd }}s
            </span>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onUnmounted } from "vue";
import { useStore } from "vuex";

import { mdiCheck } from "@mdi/js";
import TimerBar from "@/components/Games/TimerBar.vue";
import AppIcon from "@/components/AppIcon.vue";

export default defineComponent({
  name: "riddles",
  components: {
    TimerBar,
    AppIcon,
  },
  setup() {
    //
    const store = useStore();
    const riddle = computed(() => store.getters.getRiddle);
    const riddleAnswerLen = computed(() => store.getters.getRiddleAnswerLength);
    const currentTime = computed(() => store.getters.getCurrentTime);
    // watch it and calculate the remaining time before the round/turn ends
    const timer = computed(() => store.getters.getTimer);

    const remainingTimeBeforeEnd = ref<number>(-1);
    let remainingTimeInterval: number | null = null;

    // // testing
    // const startTimer = () => {
    //   store.commit("START_TIMER");
    //   // START_TIMER
    //   // STOP_TIMER
    // };

    // const stopTimer = () => {
    //   store.commit("STOP_TIMER");
    // };

    // onMounted(() => {
    //   // startTimer();
    //   //
    //   setTimeout(() => {
    //     // stopTimer();
    //     console.log(riddle);
    //     console.log(store.getters);
    //   }, 5000);
    // });
    watch(timer, (newVal: number | null, prevVal: number | null) => {
      if (prevVal !== null && newVal === null) {
        // set the remaining time to what the current time is equal to when stopped
        remainingTimeBeforeEnd.value = currentTime.value;
        // tirgger the count down
        remainingTimeInterval = setInterval(() => {
          remainingTimeBeforeEnd.value -= 1;
          // if the reamaining timer is at 0, clear the interval
          if (remainingTimeBeforeEnd.value === 0 && remainingTimeInterval) {
            clearInterval(remainingTimeInterval);
          }
        }, 1000);
      }
    });

    onUnmounted(() => {
      if (remainingTimeInterval !== null) clearInterval(remainingTimeInterval);
    });

    return {
      currentTime,
      currentRound: computed(() => store.getters.getCurrentRound),
      remainingTimeBeforeEnd,
      riddle,
      riddleAnswerLen,
      riddleAnswer: computed(() => store.getters.getWord),
      playerFoundAnswer: computed(() => store.getters.getPlayerFoundAnswer),
      //
      mdiCheck,
    };
  },
});
</script>
