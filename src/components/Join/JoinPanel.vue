<template>
  <div class="w-full flex flex-col items-center">
    <h1
      class="text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-800 text-center"
    >
      Enter a name to join your friends
    </h1>
    <div
      id="join-base"
      class="flex flex-col justify-center items-center w-11/12 bg-gray-100 py-10 rounded-md mt-10 mb-20 px-4"
    >
      <app-input
        :error="errorMessage"
        v-model:value="username"
        @update:username="username = $event"
        spellcheck="false"
        @keydown.enter="join"
      />
      <button
        class="w-60 2xl:w-80 h-12 2xl:h-16 bg-teal-400 hover:bg-teal-500 focus:bg-gray-800 text-white text-2xl 2xl:text-3xl font-bold rounded-lg ring-teal-300"
        @click="join"
      >
        <loader v-if="isBeginLoading" size="40" />
        <span v-else>Join</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, ref, computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import AppInput from "@/components/AppInput.vue";
import Loader from "../Loader.vue";
import { WsClient } from "@/ws/WsClient";

export default defineComponent({
  components: { AppInput, Loader },
  setup() {
    // const username = ref("JOINER");
    // FIXME REMOVE PRESET USERNAME AFTER TESTING
    const username = ref(localStorage.getItem("username") || "");
    const errorMessage = ref("");
    const isValidInput = () => {
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
    const route = useRoute();

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

    const join = () => {
      if (isValidInput()) {
        saveUsername();
        // start loading
        store.commit("SET_IS_BEGIN_LOADING", true);
        // get the websocket class instance
        // request a connection
        ws.initConnection({
          path: "join",
          params: {
            username: username.value,
            id: route.params.roomId as string,
          },
        });
      }
    };

    return {
      join,
      errorMessage,
      username,
      isBeginLoading: computed(() => store.getters.getIsBeginLoading),
    };
    // room
  },
});
</script>
