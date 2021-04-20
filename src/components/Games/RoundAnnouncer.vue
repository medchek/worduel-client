<template>
  <div
    id="game-announcer"
    class="flex flex-col flex-grow w-full text-gray-800 font-bold justify-center items-center"
  >
    <p class="text-5xl 2xl:text-6xl">Round {{ currentRound }}</p>
    <p
      v-if="getReady && !hasTurns"
      class="text-3xl text-teal-500 font-normal transition-all duration-300"
    >
      Get ready!
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
export default defineComponent({
  data() {
    return {
      getReady: false,
    };
  },
  computed: {
    ...mapGetters({
      currentRound: "getCurrentRound",
      hasTurns: "getHasTurns",
    }),
  },
  mounted() {
    if (!this.hasTurns) {
      setTimeout(() => {
        this.getReady = true;
      }, 1900);
    }
  },
});
</script>
