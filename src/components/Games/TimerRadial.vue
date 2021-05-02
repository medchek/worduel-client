<template>
  <svg>
    <!-- <circle class="timer-base" cy="50%" cx="50%" r="33%" /> -->
    <circle
      class="timer"
      cy="50%"
      cx="50%"
      r="33%"
      :stroke-dasharray="dashArray + '%'"
      :stroke-dashoffset="dashOffset + '%'"
    />
    test
  </svg>
  <!-- <slot></slot> -->
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const timePerRound: number = store.getters.getTimePerRound;
    const remainingTime = computed(() => store.getters.getCurrentTime);
    // value for a complete dashed circle
    const dashArray = 208;

    /**
     * Set the inital dash offset based on the remaining time.
     * Used when the client joins the game in the middle of a round
     */
    function setInitialDashOffset() {
      // if the timer hasnt started yet, set the offset to 0, meaning the circle will be full
      if (timePerRound === remainingTime.value) return 0;
      const offsetPerSecond = dashArray / timePerRound;
      const elaspedTime = timePerRound - remainingTime.value;
      // offset the circle by the amount of the elapsed seconds
      return offsetPerSecond * elaspedTime;
    }

    const dashOffset = ref(setInitialDashOffset()); // 0 = empty. 208 = full

    function startTimer() {
      store.commit("START_TIMER");
    }

    // update the dashOffset according to the timer
    watch(remainingTime, () => {
      if (dashOffset.value >= dashArray) return;
      const offset = dashArray / timePerRound; // offset per second
      const newDashOffset =
        // if the value gets greater than the full circle length
        dashOffset.value + offset > dashArray
          ? // set it to the maximum to prevent circle re-cycle
            dashArray
          : // otherwise, inrement it normanny
            dashOffset.value + offset;
      // keep only 3 decimals
      dashOffset.value = parseFloat(newDashOffset.toFixed(3));
    });

    return {
      dashOffset,
      dashArray,
      startTimer,
    };
  },
});
</script>
<style scoped>
.timer {
  fill: none;
  stroke: rgba(45, 212, 191);
  transform-origin: 50%;
  transform: rotate(90deg) scale(-1, 1);
  transition: all 0.3s;
}
.timer-base {
  fill: none;
  stroke: #d1d5db;
}
</style>
