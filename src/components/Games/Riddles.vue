<template>
  <div
    id="riddles"
    class="flex flex-col justify-center items-center flex-grow w-full md:w-10/12 h-full relative"
  >
    <!-- RIDDLE SECTION -->
    <section
      id="riddles-base"
      class="flex flex-col justify-center items-center w-full h-full"
    >
      <!-- HEADER -->

      <h1
        class="text-gray-300 text-base md:text-xl xl:text-2xl 2xl:text-3xl text-center"
      >
        Try to find the answer to the following riddle
      </h1>

      <!-- WORD DASHES -->
      <div
        id="word-to-guess"
        class="text-gray-700 h-auto my-2 text-3xl xl:text-5xl 2xl:text-6xl font-bold tracking-wider text-center flex items-center justify-center rounded"
      >
        <span v-if="riddleAnswer"> {{ riddleAnswer }}</span>
        <span v-else> {{ "-".repeat(riddleAnswerLen) }} --------- </span>
      </div>

      <div
        id="riddles-box"
        class="flex flex-col items-center justify-center rounded-lg w-full h-full md:h-60 lg:h-72 2xl:h-96 flex-grow md:flex-grow-0 relative"
        :class="[
          playerFoundAnswer
            ? 'rounded-lg bg-gradient-to-b from-bgray-100 to-teal-100'
            : 'bg-bgray-100',
        ]"
      >
        <!-- RIDDLE DISPLAY -->
        <!-- <div
          id="riddle-content"
          class="flex justify-center items-center h-full md:h-72 text-gray-800 font-bold text-center px-20 relative"
          :class="[
            // playerFoundAnswer
            //  ? 'rounded-lg bg-gradient-to-b from-bgray-100 to-teal-50'
            //  : 'rounded-t bg-bgray-100',
          ]"
        > -->
        <app-icon
          :icon="mdiCheck"
          :size="300"
          class="text-teal-500 opacity-20 absolute w-44 h-44 md:w-60 md:h-60"
          v-if="playerFoundAnswer"
        />
        <div class="flex justify-center items-center w-full h-full">
          <p
            class="text-bgray-700 absolute text-center left-0 right-0 px-1 md:px-4 lg:px-10 text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl antialiased font-bold"
          >
            {{ riddle }}
            <!-- Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
            quisquam, saepe nobis quidem non iure sequi tenetur delectus rerum
            in accusantium voluptate tempora consequatur, debitis reprehenderit
            voluptas consequuntur harum porro. -->
          </p>
        </div>
        <!-- </div> -->
        <!-- PROGRESS TIMER -->
        <timer-bar
          v-if="!playerFoundAnswer"
          class="mt-auto w-full h-6 md:h-6 2xl:h-8 md:rounded-b-md overflow-hidden text-xl 2xl:text-2xl"
        />
      </div>
      <game-meta-data class="text-bgray-400 md:rounded px-2 md:my-5" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
// import { onMounted } from "vue";
import { useStore } from "vuex";

import { mdiCheck } from "@mdi/js";
import TimerBar from "@/components/Games/TimerBar.vue";
import AppIcon from "@/components/AppIcon.vue";
import GameMetaData from "@/components/Games/GameMetaData.vue";

export default defineComponent({
  name: "riddles",
  components: {
    TimerBar,
    AppIcon,
    GameMetaData,
  },
  setup() {
    //
    const store = useStore();
    const riddle = computed(() => store.getters.getRiddle);
    const riddleAnswerLen = computed(() => store.getters.getRiddleAnswerLength);
    // const currentTime = computed(() => store.getters.getCurrentTime);
    // watch it and calculate the remaining time before the round/turn ends
    // const timer = computed(() => store.getters.getTimer);

    // const remainingTimeBeforeEnd = ref<number>(-1);
    // let remainingTimeInterval: number | null = null;

    // watch(timer, (newVal: number | null, prevVal: number | null) => {
    //   if (prevVal !== null && newVal === null) {
    //     // set the remaining time to what the current time is equal to when stopped
    //     remainingTimeBeforeEnd.value = currentTime.value;
    //     // tirgger the count down
    //     remainingTimeInterval = setInterval(() => {
    //       remainingTimeBeforeEnd.value -= 1;
    //       // if the reamaining timer is at 0, clear the interval
    //       if (remainingTimeBeforeEnd.value === 0 && remainingTimeInterval) {
    //         clearInterval(remainingTimeInterval);
    //       }
    //     }, 1000);
    //   }
    // });

    // onUnmounted(() => {
    //   if (remainingTimeInterval !== null) clearInterval(remainingTimeInterval);
    // });

    return {
      // currentTime,
      // currentRound: computed(() => store.getters.getCurrentRound),
      // remainingTimeBeforeEnd,
      riddle,
      riddleAnswerLen,
      riddleAnswer: computed(() => store.getters.getWord),
      playerFoundAnswer: computed(() => store.getters.getPlayerFoundAnswer),
      // playerFoundAnswer: true,
      //
      mdiCheck,
    };
  },
});
</script>
