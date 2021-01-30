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
          :value="roomUrl"
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
          label="time per round"
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
        class="w-1/3 2xl:w-5/12 h-10 2xl:h-14 bg-gray-800 mx-auto text-white rounded-lg text-2xl font-bold hover:bg-gray-900 transition-colors duration-150 focus:ring-4 ring-teal-300"
      >
        start
      </app-button>
      <!-- not leader display-->
      <div
        v-else
        class="flex justify-center items-center w-1/2 h-10 2xl:h-14 bg-gray-300 mx-auto text-gray-500 rounded-md text-lg 2xl:text-xl cursor-default font-bold"
      >
        Waiting for {{ leaderName }} to start the game
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed } from "vue";
import { mdiContentCopy } from "@mdi/js";

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
      ws.dispatch.updateSettings(2, id);
    };
    const timeSelected = (id: number) => {
      // console.log("selected timePerRound => ", id);
      ws.dispatch.updateSettings(3, id);
    };

    const linkInputRef = ref<HTMLInputElement | null>(null);

    const copyGameLink = () => {
      if (linkInputRef.value) {
        linkInputRef.value.select();
        linkInputRef.value.setSelectionRange(0, 99999);
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("could not copy to clipboard", err);
        }
      }
    };
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
    };
    return {
      mdiContentCopy,
      settings,
      gameOptions,
      difficulty,
      roundCount,
      timePerRound,
      linkInputRef,
      copyGameLink,
      roomUrl,
      difficultySelected,
      roundSelected,
      timeSelected,
      player,
      leaderName,
      startBtnTitle,
      requestGameStart,
      isBtnLoading,
    };
  },
});
</script>
