<template>
  <div
    class="bg-gray-50 h-28 md:h-40 2xl:h-64 w-10/12 2xl:w-full mx-auto flex justify-center items-center"
  >
    <button
      v-for="game in games"
      :key="game.id"
      @click="setSelectedGame(game.id)"
      class="flex justify-center items-center w-20 h-20 md:w-32 md:h-32 2xl:w-40 2xl:h-40 mx-3 font-bold text-xl lg:text-3xl rounded-xl md:rounded-3xl text-gray-100 shadow-xl bg-gradient-to-br focus:from-gray-900 focus:to-blue-900 focus:outline-none focus:shadow-inner"
      :disabled="!game.available"
      :title="
        !game.available ? `This game is not available yet` : `select this game`
      "
      :class="[
        selectedGame === game.id
          ? `from-gray-900 to-blue-900 focus:outline-none shadow-inner hover:from-gray-800 hover:to-blue-600`
          : `from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-300`,
      ]"
    >
      {{ game.name }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  emits: ["game-selected"],
  setup(props, { emit }) {
    const store = useStore();
    const selectedGame: Ref<number | null> = ref(1); // the id of the selected game
    const games = [
      { id: 1, name: "shuffler", available: true, selected: false },
      { id: 2, name: "guess", available: false, selected: false },
      { id: 3, name: "chance", available: false, selected: false },
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
      selectedGame.value = id;
      emit("game-selected", id);
      store.commit("SET_SELECTED_GAME", id);
    };
    return { selectedGame, games, setSelectedGame };
  },
});
</script>
