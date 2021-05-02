<template>
  <section
    id="room-settings"
    class="flex flex-col flex-grow rounded-t-lg md:overflow-hidden md:ml-2"
  >
    <!-- PARTY OPEN BTN -->
    <!-- <button
      class="md:hidden w-full h-10 bg-bgray-100 text-gray-800 mb-2 md:my-0 rounded-md font-bold shadow-md"
    >
      <app-icon :icon="mdiAccountGroup" />
      <span class="ml-2">Party</span>
    </button> -->
    <!-- Setting Header -->
    <h1
      class="flex items-center justify-start pl-4 text-lg md:text-xl 2xl:text-2xl bg-gray-800 text-gray-50 h-10 md:h-12 2xl:h-16 rounded-t-lg"
    >
      Room settings
    </h1>
    <!-- Setting base -->
    <div
      id="settings-base"
      class="flex flex-col w-full px-4 py-2 flex-grow bg-gray-200"
    >
      <!-- TEXT -->
      <p class="text-sm md:text-lg 2xl:text-xl text-gray-500 font-semibold">
        Give this link to your friends so they can join you
      </p>
      <!--  GAME ROOM URL INPUT SECTION -->
      <section
        id="link-input-section"
        class="flex flex-col md:flex-row w-full h-auto md:h-12 2xl:h-14 my-2"
      >
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
          :value="roomUrl"
          class="flex-grow h-10 md:h-full rounded-lg 2xl:rounded-xl pl-2 md:pl-4 text-teal-400 font-bold text-base md:text-xl focus:ring-2 focus:ring-teal-200 shadow-sm mb-2 md:mb-0"
        />
        <!-- COPY BTN -->
        <button
          title="copy to clipboard"
          class="ml-0 md:ml-2 lg:ml-4 w-full md:w-14 h-8 md:h-full bg-white text-gray-800 focus:ring-teal-200 active:bg-gray-800 active:text-white shadow-sm rounded-md md:rounded-lg 2xl:rounded-xl"
          @click="copyGameLink"
        >
          <app-icon :icon="mdiContentCopy" />
          <span class="md:hidden font-bold ml-0.5">{{ copyText }}</span>
        </button>
      </section>
      <!-- HORIZONTAL LINE -->
      <hr class="border-none h-0.5 bg-teal-300 mt-1 md:mt-2 opacity-25" />
      <!-- SELECTS FROM -->
      <div
        id="select-form"
        class="flex items-center flex-col flex-grow pt-2 h-20 border-b-2 border-bgray-400 border-opacity-60 mb-2 sm:border-b-0 md:mb-0 sm:h-auto overflow-y-auto md:overflow-y-visible px-1 md:px-0"
      >
        <lobby-setting label="selected game" :options="gameOptions" />

        <lobby-setting
          label="difficulty"
          :options="difficulty.options"
          @idSelected="difficultySelected($event)"
          :defaultSelectedIndex="1"
          :sid="difficulty.sid"
        />

        <lobby-setting
          label="total rounds"
          :options="roundCount.options"
          @idSelected="roundSelected($event)"
          :defaultSelectedIndex="2"
          :sid="roundCount.sid"
        />
        <lobby-setting
          :label="`time per ${hasTurns ? 'turn' : 'round'}`"
          :options="timePerRound.options"
          @idSelected="timeSelected($event)"
          :defaultSelectedIndex="1"
          :sid="timePerRound.sid"
          appendText="sec"
        />
      </div>
      <!-- START BUTTON -->
      <!-- leader display -->
      <app-button
        :title="startBtnTitle"
        v-if="player.isLeader"
        :loading="isBtnLoading"
        @click="requestGameStart"
        class="w-full md:w-1/2 2xl:w-5/12 h-12 2xl:h-14 bg-gray-800 mx-auto text-white rounded-lg text-xl xl:text-2xl font-bold hover:bg-gray-900 transition-colors duration-150 focus:ring-4 ring-teal-300"
      >
        start
      </app-button>
      <!-- not leader display-->
      <div
        v-else
        class="flex justify-center items-center w-full sm:w-1/2 md:w-3/5 h-10 md:h-12 2xl:h-14 bg-gray-300 mx-auto text-gray-500 rounded-md text-sm md:text-base lg:text-lg 2xl:text-xl cursor-default font-bold"
      >
        Waiting for {{ leaderName }} to start the game
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onUnmounted } from "vue";
import { mdiContentCopy, mdiAccountGroup } from "@mdi/js";

import { useStore } from "vuex";
import { WsClient } from "@/ws/WsClient";
// components
import AppIcon from "../AppIcon.vue";
import LobbySetting from "./LobbySetting.vue";
import AppButton from "@/components/AppButton.vue";

import {
  gameOptions,
  difficulty,
  roundCount,
  timePerRound,
} from "../../config/settings";

export default defineComponent({
  components: { LobbySetting, AppIcon, AppButton },
  setup() {
    const store = useStore();
    const roomUrl = `${location.protocol}//${location.host}/join/${store.getters.getRoomId}`;

    const ws = inject("ws") as WsClient;

    const difficultySelected = (id: number) => {
      // console.log("selected difficulty => ", id);
      ws.dispatch.updateSettings(1, id);
    };
    const roundSelected = (id: number) => {
      // console.log("selected roundCount => ", id);
      const totalRounds = roundCount.options.find(option => option.id == id);
      if (totalRounds) {
        store.commit("SET_ROUND_COUNT", totalRounds.value);
      }
      ws.dispatch.updateSettings(2, id);
    };
    const timeSelected = (id: number) => {
      const roundTime = timePerRound.options.find(option => option.id == id);
      if (roundTime) {
        store.commit("SET_TIME_PER_ROUND", roundTime.value);
      }
      // console.log("selected timePerRound => ", id);
      ws.dispatch.updateSettings(3, id);
    };

    const linkInputRef = ref<HTMLInputElement | null>(null);
    const copyText = ref<string>("copy");
    let revertCopyText: number | null = null;

    const copyGameLink = () => {
      if (linkInputRef.value) {
        linkInputRef.value.select();
        linkInputRef.value.setSelectionRange(0, 99999);

        if (revertCopyText) clearInterval(revertCopyText);
        copyText.value = "copied!";
        revertCopyText = setTimeout(() => {
          copyText.value = "copy";
        }, 1000);
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("could not copy to clipboard", err);
        }
      }
    };
    onUnmounted(() => {
      if (revertCopyText) clearTimeout(revertCopyText);
    });

    const settings = computed(() => store.getters.getSettings);
    const player = computed(() => store.getters.getPlayer);
    const startBtnTitle = computed(() => {
      return store.getters.getPartyLength > 1
        ? "start the game"
        : "More players are needed to start the game";
    });

    const leaderName = computed(() => {
      const party = store.getters.getParty;
      const leaderId = Object.keys(party).find(
        member => party[member].isLeader === true
      );
      return leaderId ? party[leaderId].username : "leader";
    });

    const isBtnLoading = ref(false);
    const requestGameStart = () => {
      if (store.getters.getPartyLength > 1) {
        isBtnLoading.value = true;
        ws.dispatch.startGame();
      } else {
        store.commit("SET_SNACK", {
          type: "info",
          message: "More players are needed to start the game",
        });
      }

      // open party btn
      // const showPartyPanel = false;
    };
    return {
      // icons
      mdiContentCopy,
      mdiAccountGroup,
      //
      settings,
      gameOptions,
      difficulty,
      roundCount,
      timePerRound,
      linkInputRef,
      copyGameLink,
      copyText,
      roomUrl,
      difficultySelected,
      roundSelected,
      timeSelected,
      player,
      leaderName,
      startBtnTitle,
      requestGameStart,
      isBtnLoading,
      hasTurns: computed(() => store.getters.getHasTurns),
    };
  },
});
</script>
