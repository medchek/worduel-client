<template>
  <div
    id="score-announcer"
    class="flex flex-col flex-grow w-full text-gray-800 font-bold justify-center items-center"
  >
    <h1 class="text-3xl mb-2">
      <span v-if="gameEnded">Final scores</span>
      <span v-else>Scores</span>
    </h1>
    <div
      v-for="(playerScore, index) in scores"
      :key="index"
      id="player-score"
      class="flex items-center w-1/2 bg-gray-200 h-12 rounded-lg overflow-hidden my-2"
    >
      <div
        v-if="gameEnded"
        class="h-full flex justify-center items-center text-xl w-8 bg-gray-300"
      >
        {{ index + 1 }}
      </div>
      <span id="player-score-name" class="text-xl pl-2"
        >{{ playerScore.username }}
        <span class="text-base" v-if="gameEnded && playerScore.id == playerId"
          >(you)</span
        >
      </span>
      <div
        id="score-points"
        class="ml-auto h-full w-10 flex justify-center items-center bg-gray-800 text-white"
      >
        {{ playerScore.score }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PlayerScore } from "@/store/modules/Room";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  computed: {
    ...mapGetters({
      roundScore: "getRoundScore",
      finalScores: "getFinalScores",
      gameEnded: "getGameEnded",
      playerId: "getPlayerId",
    }),
    scores(): PlayerScore[] {
      if (this.gameEnded) {
        return this.finalScores as PlayerScore[];
      } else {
        return this.roundScore as PlayerScore[];
      }
    },
  },
});
</script>
