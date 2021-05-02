<template>
  <!-- DISPLAYED FOR NON-LEADER PLAYERS -->
  <div
    class="h-full w-full md:w-full flex flex-grow items-center relative bg-gray-400 bg-opacity-50 text-gray-700 rounded-lg pl-5 font-bold text-base md:text-lg 2xl:text-xl"
  >
    {{ selectDisplayValue }}
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

import { gameOptions, difficulty } from "../../config/settings";

export default defineComponent({
  props: {
    sid: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    // return the value depending on the sid
    // if the sid does not exists, display game name based on the store gameId
    const selectDisplayValue = computed(() => {
      if (props.sid) {
        if (props.sid == 1) {
          return difficulty.options.find(
            option => option.id == store.getters.getSettings.difficulty
          ).value;
        } else if (props.sid == 2) {
          return store.getters.getSettings.roundCount;
        } else if (props.sid == 3) {
          return `${store.getters.getSettings.timePerRound} sec`;
        } else {
          return null;
        }
      } else {
        return gameOptions.find(option => option.id == store.getters.getGameId)
          .value;
      }
    });
    return { selectDisplayValue };
  },
});
</script>
