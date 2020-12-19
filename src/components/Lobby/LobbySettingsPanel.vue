<template>
  <section
    id="room-settings"
    class="flex flex-col flex-grow bg-gray-200 ml-2 rounded-t-lg overflow-hidden"
  >
    <!-- Setting Header -->
    <h1
      class="flex items-center pl-4 text-xl 2xl:text-2xl bg-gray-800 text-gray-50 h-12 2xl:h-16"
    >
      Room settings
    </h1>
    <!-- Setting base -->
    <div id="settings-base" class="flex flex-col w-full px-4 py-2 flex-grow">
      <!-- TEXT -->
      <p class="text-lg 2xl:text-xl text-gray-500 font-semibold">
        Give this link for your friends to join you
      </p>
      <!--  INPUT SECTION -->
      <div id="link-input" class="flex w-full h-10 2xl:h-14 my-2">
        <input
          id="game-url"
          type="text"
          readonly
          spellcheck="false"
          ref="linkInputRef"
          @focus="
            () => {
              linkInputRef.select();
            }
          "
          value="http://localhost:3000/join/pTYu3aY0DTvr6-hvfJGlc"
          class="flex-grow h-full rounded-lg 2xl:rounded-xl pl-4 text-teal-400 font-bold text-xl focus:ring-2 focus:ring-teal-200 shadow-sm"
        />
        <button
          title="copy to clipboard"
          class="ml-4 w-10 2xl:w-14 rounded-lg 2xl:rounded-xl bg-white h-full text-gray-800 focus:ring-teal-200 focus:bg-gray-800 focus:text-white shadow-sm"
          @click="copyGameLink"
        >
          <app-icon :icon="mdiContentCopy" />
        </button>
      </div>
      <!-- HORIZONTAL LINE -->
      <hr class="border-none h-0.5 bg-teal-300 my-4 opacity-25" />
      <!-- SELECTS FROM -->
      <div id="select-form" class="flex flex-col flex-grow">
        <lobby-setting
          label="selected game"
          :options="gameOptions"
          @idSelected="logId($event)"
        />
        <lobby-setting
          label="difficulty"
          :options="difficultyOptions"
          @idSelected="logId($event)"
          :defaultSelectedId="2"
        />

        <lobby-setting
          label="total rounds"
          :options="totalRoundsOptions"
          :defaultSelectedId="3"
        />
        <lobby-setting
          label="time per round"
          :options="timePerRoundOptions"
          :defaultSelectedId="2"
        />
      </div>
      <!-- START BUTTON -->
      <button
        class="w-1/3 2xl:w-5/12 h-10 2xl:h-14 bg-gray-800 mx-auto text-white rounded-lg text-2xl font-bold hover:bg-gray-900 transition-colors duration-150 focus:ring-4 ring-teal-300"
      >
        start
      </button>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mdiContentCopy } from "@mdi/js";
import LobbySetting from "./LobbySetting.vue";
import AppIcon from "../AppIcon";
export default defineComponent({
  components: { LobbySetting, AppIcon },
  setup() {
    const gameOptions = [
      {
        id: 1,
        value: "Shuffle",
        selectable: true,
      },
      {
        id: 2,
        value: "Guess",
        selectable: false,
      },
      {
        id: 3,
        value: "Chance",
        selectable: false,
      },
    ];
    const difficultyOptions = [
      { id: 1, value: "easy" },
      { id: 2, value: "normal" },
      { id: 3, value: "hard" },
      { id: 4, value: "very hard" },
    ];
    const totalRoundsOptions = [
      { id: 1, value: 2 },
      { id: 2, value: 4 },
      { id: 3, value: 6 },
      { id: 4, value: 8 },
      { id: 5, value: 10 },
    ];

    const timePerRoundOptions = [
      { id: 1, value: "30 sec" },
      { id: 2, value: "60 sec" },
      { id: 3, value: "90 sec" },
      { id: 4, value: "120 sec" },
      { id: 5, value: "150 sec" },
    ];

    const logId = id => {
      console.log(id);
    };

    const linkInputRef = ref(null);
    const copyGameLink = () => {
      linkInputRef.value.select();
      linkInputRef.value.setSelectionRange(0, 99999);
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("could not copy to clipboard", err);
      }
    };
    return {
      mdiContentCopy,
      gameOptions,
      difficultyOptions,
      totalRoundsOptions,
      timePerRoundOptions,
      logId,
      linkInputRef,
      copyGameLink,
    };
  },
});
</script>
