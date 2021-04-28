<template>
  <div
    id="game-announcer"
    class="flex flex-col flex-grow w-full text-gray-800 font-bold justify-center items-center"
  >
    <p class="text-5xl 2xl:text-6xl">{{ currentTurnPlayer }}'s turn</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
export default defineComponent({
  computed: {
    ...mapGetters({
      currentTurnPlayer: "getCurrentTurnPlayerName",
    }),
  },
});
</script>
