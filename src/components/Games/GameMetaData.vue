<template>
  <section
    id="round-meta"
    class="flex flex-row justify-between w-full text-sm sm:text-base md:text-lg font-bold"
  >
    <div>round {{ currentRound }}/6</div>
    <div>
      <span v-if="remainingTimeBeforeEnd == -1"> {{ currentTime }}s </span>
      <span v-else title="time remaining before the round ends">
        ending in: {{ remainingTimeBeforeEnd }}s
      </span>
    </div>
  </section>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent, computed, watch, onUnmounted, ref } from "vue";
// tests
// import { onMounted } from "vue";
export default defineComponent({
  setup() {
    const store = useStore();
    const currentTime = computed(() => store.getters.getCurrentTime);
    // watch it and calculate the remaining time before the round/turn ends
    const timer = computed(() => store.getters.getTimer);

    const remainingTimeBeforeEnd = ref<number>(-1);
    let remainingTimeInterval: number | null = null;

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
    //   startTimer();
    //   //
    //   setTimeout(() => {
    //     stopTimer();
    //   }, 5000);
    // });

    return {
      currentRound: computed(() => store.getters.getCurrentRound),
      remainingTimeBeforeEnd,
      currentTime,
    };
  },
});
</script>
s
