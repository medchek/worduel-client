<template>
  <div
    class="w-full text-center relative overflow-hidden flex flex-col transition-all"
  >
    <div
      id="langing-bg"
      class="landing-curved absolute h-40 2xl:h-48 bg-gradient-to-br from-green-400 to-teal-400 w-full right-0 left-0 mx-auto z-0"
    ></div>
    <div
      class="w-4/5 lg:w-3/4 xl:w-3/5 mx-auto text-center mt-5 2xl:mt-8 font-semibold text-white z-10 relative"
    >
      <h1 class="text-2xl sm:text-4xl md:text-5xl 2xl:text-6xl">
        Word themed multiplayer games to enjoy with your friends
      </h1>
    </div>
    <!-- NICKNAME INPUT SECTION -->
    <section class="mt-5 w-4/5 2xl:w-3/5 mx-auto relative z-10">
      <app-input
        v-model:value="username"
        @update:username="username = $event"
        placeholder="Enter a nickname"
        spellcheck="false"
        :error="errorMessage"
      />
    </section>
    <!-- GAME SELECTION SECTION -->
    <section
      class="flex-grow flex flex-col justify-between w-4/5 2xl:w-3/5 mx-auto py-3 md:py-5 relative z-10"
    >
      <h3
        class="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-bgray-800"
      >
        Select a game
      </h3>
      <!-- GAMES -->
      <game-selector
        @game-selected="selectedGame = $event"
        class="flex-grow my-2 md:my-5 2xl:my-10"
      />
      <!-- Begin button -->
      <app-button
        class="flex justify-center items-center w-full lg:w-3/5 h-14 sm:h-20 mx-auto text-gray-100 rounded-lg font-bold text-2xl md:text-3xl shadow-sm hover:shadow-lg transition-all duration-200 focus:shadow-inner focus:bg-black focus:outline-none"
        :class="
          isBeginLoading ? 'bg-gray-700' : 'bg-gray-900  hover:bg-gray-800'
        "
        @click="begin"
        :disabled="isBeginLoading"
        :loading="isBeginLoading"
        >Begin</app-button
      >
    </section>
  </div>
</template>

<script lang="ts">
import { watch, defineComponent, ref, inject, computed } from "vue";
import AppInput from "@/components/AppInput.vue";
import GameSelector from "@/components/GameSelector.vue";
import AppButton from "@/components/AppButton.vue";
// hooks
import { WsClient } from "@/ws/WsClient";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    // const username = ref("Creator");
    // FIXME REMOVE PRESET USERNAME AFTER TESTING
    const username = ref(localStorage.getItem("username") || "");
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
          "Your nickname must be 3 to 15 in length and connot contain special characters";
        return false;
      }
      return true;
    };

    //
    const ws = inject("ws") as WsClient;
    const store = useStore();

    /** Store the username entered by the user in the localStorage */
    const saveUsername = (): void => {
      const savedUsername = localStorage.getItem("username");
      if (savedUsername) {
        // if the usernamed stored in localStorage is similar to the one entered by the user
        if (savedUsername == username.value) return; // don't do noting, and exit the function
      }
      // otherwise, save the new username
      localStorage.setItem("username", username.value);
    };

    const begin = (): void => {
      if (isValidInput()) {
        saveUsername();
        // start loading
        store.commit("SET_IS_BEGIN_LOADING", true);
        // get the websocket class instance
        // request a connection
        ws.initConnection({
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
    AppButton,
  },
});
</script>

<style scoped>
.landing-curved {
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  transform: scale(3.5);
}
</style>
