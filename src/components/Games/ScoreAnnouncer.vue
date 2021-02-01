<template>
  <div
    id="score-announcer"
    class="flex flex-col flex-grow w-full text-gray-800 font-bold justify-center items-center"
  >
    <h1 class="text-3xl mb-2">Scores</h1>
    <div
      v-for="(score, playerName, index) in roundScore"
      :key="index"
      id="player-score"
      class="flex items-center w-1/2 bg-gray-200 h-12 rounded-lg overflow-hidden my-2"
    >
      <span id="player-score-name" class="text-xl pl-2">{{ playerName }}</span>
      <div
        id="score-points"
        class="ml-auto h-full w-10 flex justify-center items-center bg-gray-800 text-white"
      >
        {{ score }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  computed: {
    ...mapGetters({
      roundScore: "getRoundScore",
    }),
  },
});
</script>
