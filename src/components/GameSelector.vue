<template>
  <div
    class="bg-gray-50 h-28 sm:h-40 md:h-48 2xl:h-64 w-full 2xl:w-full mx-auto flex justify-center items-center rounded px-1"
  >
    <button
      v-for="game in games"
      :key="game.id"
      @click="setSelectedGame(game.id)"
      class="flex justify-center items-center w-20 h-20 sm:h-28 sm:w-28 md:w-32 md:h-32 2xl:w-40 2xl:h-40 mx-1 lg:mx-3 font-bold text-lg md:text-3xl rounded-lg sm:rounded-xl md:rounded-3xl text-gray-100 shadow-xl bg-gradient-to-br focus:outline-none focus:shadow-inner"
      :disabled="isBeginLoading"
      :title="
        !game.available ? `This game is not available yet` : `select this game`
      "
      :class="[
        !game.available && 'cursor-not-allowed focus:ring-0',
        game.available && 'focus:from-gray-900 focus:to-blue-900',
        selectedGame === game.id
          ? `from-gray-900 to-blue-900 shadow-inner hover:from-gray-800 hover:to-blue-600`
          : !game.available
          ? 'bg-bgray-400 opacity-50'
          : `from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-300`,
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
