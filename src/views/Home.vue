<template>
  <div class="w-full text-center">
    <div
      class="w-11/12 mx-auto lg:w-2/3 xl:w-1/2 text-center mt-5 2xl:mt-8 font-semibold text-teal-500"
    >
      <h1 class="text-xl sm:text-3xl lg:text-4xl 2xl:text-5xl">
        Word themed multiplayer games to enjoy with your friends
      </h1>
    </div>
    <!-- GAMES SELECTION PARTH -->
    <div class="border-t-2 border-teal-700 mt-5 2xl:mt-10 pt-5 w-3/4 mx-auto">
      <app-input
        v-model:value="username"
        @update:username="username = $event"
        placeholder="Enter a nickname"
        spellcheck="false"
        :error="errorMessage"
      />
      <h3
        class="text-2xl sm:text-3xl font-bold text-gray-800 mt-4 2xl:mb-6 mb-5"
      >
        Select a game
      </h3>
      <!-- GAMES -->
      <game-selector @game-selected="selectedGame = $event" />
    </div>
    <button
      class="flex justify-center items-center mt-5 2xl:mt-10 mb-4 w-1/3 h-16 mx-auto text-gray-100 rounded-lg font-bold text-2xl shadow-sm hover:shadow-lg transition-all duration-200 focus:shadow-inner focus:bg-black focus:outline-none"
      :class="[
        isBeginLoading ? 'bg-gray-700' : 'bg-gray-900  hover:bg-gray-800',
      ]"
      @click="begin"
      :disabled="isBeginLoading"
    >
      <loader v-if="isBeginLoading" size="40" />
      <span v-else>Begin</span>
    </button>
  </div>
</template>

<script lang="ts">
import {
  watch,
  defineAsyncComponent,
  defineComponent,
  ref,
  inject,
  computed,
} from "vue";
import AppInput from "@/components/AppInput.vue";
import GameSelector from "@/components/GameSelector.vue";
// hooks
import { WsClient } from "@/ws/WsClient";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const username = ref("");
    const selectedGame = ref(1);
    const errorMessage = ref("");
    // watch for input changes and update (display or hide) the error message accordingly
    watch(username, newUsername => {
      if (newUsername === "" || /^[a-zA-Z0-9_. -]{3,15}$/.test(newUsername)) {
        errorMessage.value = "";
      }
    });
    const isValidInput = (): boolean => {
      if (!/^[a-zA-Z0-9_. -]{3,15}$/.test(username.value)) {
        errorMessage.value =
          "You nickname must be 3 to 15 in length and connot contain special characters";
        return false;
      }
      return true;
    };

    //
    const ws = inject("ws") as WsClient;
    const store = useStore();

    const begin = (): void => {
      if (isValidInput()) {
        // start loading
        store.commit("SET_IS_BEGIN_LOADING", true);
        // get the websocket class instance
        // request a connection
        ws.initConnection({
          host: "localhost",
          port: 9000,
          path: "create",
          params: {
            username: username.value,
            id: selectedGame.value.toString(),
          },
        });
      }
    };

    return {
      begin,
      username,
      errorMessage,
      isBeginLoading: computed(() => store.getters.getIsBeginLoading),
      selectedGame,
    };
  },
  name: "Home",
  components: {
    AppInput,
    GameSelector,
    Loader: defineAsyncComponent(() => import("../components/Loader.vue")),
  },
});
</script>
