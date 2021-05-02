<template>
  <div
    class="flex flex-col lg:flex-row justify-center items-center bg-gradient-to-b from-gray-50 to-bgray-200 h-36 sm:h-40 md:h-48 2xl:h-64 w-full mx-auto rounded-lg py-5 px-6"
  >
    <button
      v-for="game in games"
      :key="game.id"
      @click="setSelectedGame(game.id)"
      class="w-full md:w-11/12 h-full md:h-36 lg:w-56 lg:h-56 xl:w-60 xl:h-60 flex justify-center items-center my-2 lg:mx-3 font-bold text-2xl sm:text-4xl md:text-4xl xl:text-4xl rounded-lg lg:rounded-3xl focus:outline-none capitalize"
      :disabled="isBeginLoading"
      :title="
        !game.available ? `This game is not available yet` : `select this game`
      "
      :class="[
        // IF GAME IS NOT AVAILABLE
        !game.available &&
          'cursor-not-allowed focus:ring-0 bg-gray-200 text-gray-300 border-4 border-gray-300 shadow-none',
        // IF GAME IS IS AVAILABLE
        game.available &&
          'focus:from-teal-800 focus:to-cyan-900 text-white shadow-xl bg-gradient-to-br',
        // IF GAME IS SELECTED
        selectedGame === game.id
          ? `from-teal-800 to-cyan-900 shadow-inner focus:ring-4 lg:focus:ring-8 ring-4 lg:ring-8 ring-teal-400 hover:from-teal-800 hover:to-teal-600`
          : // REMOVE HOVER EFFECTS FROM UNAIVAILABLE GAMES
          !game.available
          ? ''
          : // DEFAULT STYLING
            `from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-300`,
      ]"
    >
      {{ game.name }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  emits: ["game-selected"],
  setup(props, { emit }) {
    const store = useStore();
    const isBeginLoading = computed(() => store.getters.getIsBeginLoading);
    const selectedGame: Ref<number | null> = ref(1); // the id of the selected game
    const games = [
      { id: 1, name: "shuffler", available: true, selected: true },
      { id: 2, name: "guess", available: false, selected: false },
      { id: 3, name: "riddles", available: true, selected: false },
    ];

    const setSelectedGame = (id: number): void => {
      const isAvailable = games.find(game => game.id === id);
      if (!isAvailable?.available) {
        store.commit("SET_SNACK", {
          type: "info",
          message: "This game is not available yet",
        });
        return;
      }
      if (isBeginLoading.value) return;

      selectedGame.value = id;
      emit("game-selected", id);
      store.commit("SET_GAME_ID", id);
    };
    return { selectedGame, games, setSelectedGame, isBeginLoading };
  },
});
</script>
