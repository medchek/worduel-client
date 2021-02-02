<template>
  <!-- Player -->
  <div
    id="player"
    class="flex items-center w-95/1 my-2 h-10 xl:h-11 2xl:h-14 mx-auto rounded-md text-gray-900 overflow-hidden shadow"
    :class="{
      'border-b-2 border-gray-800': player.isTurn && !isLobby,
      'bg-teal-100': player.foundAnswer,
      'bg-gray-100': !player.foundAnswer,
    }"
  >
    <!-- Turn circle section -->
    <turn-circle :is-turn="player.isTurn" />
    <!-- Name -->
    <div id="player-name" class="flex-grow font-semibold text-lg">
      {{ player.username }}
    </div>
    <!-- SCORE -->
    <div
      id="score"
      class="flex items-center justify-center h-full text-md font-bold w-10 bg-gray-800 text-gray-50"
    >
      {{ score }}
    </div>
    <!-- score -->
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import TurnCircle from "./TurnCircle.vue";

export default defineComponent({
  props: {
    player: {
      type: Object,
      required: true,
    },
  },
  components: { TurnCircle },
  computed: {
    ...mapGetters({ isLobby: "getIsLobby" }),
    score() {
      const score = this.player.score;
      if (score >= 0 && score <= 9) {
        return `00${score}`;
      } else if (score >= 10 && score <= 99) {
        return `0${score}`;
      } else {
        return score;
      }
    },
  },
});
</script>
