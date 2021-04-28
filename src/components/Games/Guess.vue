<template>
  <div
    id="guess"
    class="flex flex-col justify-center items-center flex-grow w-11/12 relative"
  >
    <!-- HINT BOX -->
    <section
      id="guess-base"
      class="flex flex-col justify-center items-center flex-grow w-full"
    >
      <!-- HEADER -->

      <h1
        class="text-gray-300 text-xl xl:text-2xl 2xl:text-3xl text-center w-full"
      >
        {{
          !isTurn
            ? "Wait for the hints and try to guess the word"
            : "Send hints to other players to help them guess the word"
        }}
      </h1>

      <!-- WORD DASHES -->
      <div
        id="word-to-guess"
        class="text-gray-700 h-20 w-full my-2 text-3xl xl:text-5xl 2xl:text-6xl font-bold tracking-wider text-center flex items-center justify-center rounded"
      >
        <!-- - - - - - - - -->
        {{ word }}
      </div>
      <!-- HINT BOX -->
      <div
        id="hint-box"
        class="flex flex-col w-full rounded-lg"
        :class="{ 'h-1/2': !isTurn }"
      >
        <!-- HINT INPUT FOR CURRENT PLAYER -->
        <form
          class="w-full flex flex-col items-center relative"
          v-if="isTurn"
          @submit.prevent="sendHint"
        >
          <input
            ref="hintInput"
            :readonly="!canSendHint"
            autofocus
            v-model="hint"
            maxlength="100"
            type="text"
            class="input-custom h-14 xl:h-16 2xl:h-24 bg-bgray-50 text-xl xl:text-2xl 2xl:text-4xl text-gray-900 font-bold placeholder-gray-300 rounded-t-lg focus:ring-2 ring-teal-100 hover:bg-bgray-100 w-full"
            placeholder="Type your hint here..."
          />
          <!-- SEND HINT THROTTLE -->
          <div
            v-if="!canSendHint"
            id="send-throttle-time"
            class="animate-throttle bg-gradient-to-l from-bgray-600 to-bgray-800 w-full h-1 absolute bottom-0 left-0 animate-pulse"
          ></div>
        </form>

        <!-- NOT TURN HINT DISPLAY -->
        <div
          v-else
          class="text-2xl 2xl:text-4xl h-full flex items-center justify-center text-gray-400 bg-bgray-50 rounded-t"
        >
          <div class="w-full flex justify-center" v-if="!isTurn && !guessHint">
            {{ currentPlayer }} is typing a hint
            <span class="typing w-10 text-left"></span>
          </div>
          <span v-else class="text-gray-800 font-bold">{{ guessHint }}</span>
        </div>
        <!-- PROGRESS TIMER -->
        <div
          id="progress-timer-base"
          class="flex flex-col justify-center mt-auto w-full h-6 2xl:h-8 bg-gray-300 relative rounded-b-md overflow-hidden"
        >
          <div
            id="progress-timer-backgournd"
            class="absolute w-full text-xl 2xl:text-2xl text-white z-10 text-center"
          >
            {{ currentTime }}s
          </div>
          <div
            id="progress-timer-overlay"
            :style="{ width: progress }"
            class="h-full bg-gradient-to-r from-teal-300 to-teal-500 absolute transition-all"
          ></div>
        </div>
        <!-- ERROR & CHAR LIMIT DISPLAY -->
        <div
          v-if="isTurn"
          class="w-full h-5 flex justify-between items-center text-tgray-300"
        >
          <span id="error-display"></span>
          <span id="char-limit" :class="{ 'text-red-600': hintLenCount > 100 }"
            >{{ hintLenCount }}/100</span
          >
        </div>
      </div>
    </section>
    <!-- ROUND INFO -->
    <section
      class="flex flex-row justify-between px-2 w-full text-lg font-bold text-gray-300 my-5"
    >
      <div>round {{ currentRound }}/6</div>
      <div>{{ currentPlayer }}'s turn</div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
// import Timer from "./Timer.vue";
// import AppIcon from "@/components/AppIcon.vue";

import { mdiCheck } from "@mdi/js";
import { WsClient } from "@/ws/WsClient";

export default defineComponent({
  setup() {
    const store = useStore();

    const timePerTurn = computed(() => store.getters.getTimePerRound);
    const currentTime = computed(() => store.getters.getCurrentTime);

    const progress = computed(() => {
      return (currentTime.value * 100) / timePerTurn.value + "%";
    });

    const hintInput = ref<HTMLInputElement | null>(null);
    // throttling tracker
    const canSendHint = ref<boolean>(true);
    const hint = ref<string>("");
    const hintLenCount = computed(() => {
      return hint.value.length <= 100 ? hint.value.length : 100;
    });

    let throttle: number | null = null;

    const ws = inject("ws") as WsClient;
    const sendHint = () => {
      // if the input is empty or greater than 100 chars, dont run anything
      if (
        hint.value.length <= 0 ||
        hint.value.length > 100 ||
        !canSendHint.value
      ) {
        return;
      }
      // unfocus the input
      if (hintInput.value) hintInput.value.blur();

      // prevent further hint sending for throttle
      canSendHint.value = false;
      // dispatch the event to the server
      ws.dispatch.sendHint(hint.value);

      // throttle the input for 1.5sec
      throttle = setTimeout(() => {
        canSendHint.value = true;
        if (hintInput.value) hintInput.value.focus();
        if (throttle) clearTimeout(throttle);
      }, 1000);
      // reset the input
      hint.value = "";
    };

    onUnmounted(() => {
      if (throttle) clearTimeout(throttle);
    });

    return {
      word: computed(() => store.getters.getWord),
      playerFoundAnswer: computed(() => store.getters.getPlayerFoundAnswer),
      mdiCheck,
      currentRound: computed(() => store.getters.getCurrentRound),
      roundCount: computed(() => store.getters.getRoundCount),
      remainingTime: computed(() => store.getters.getCurrentTime),
      hasFoundAnswer: computed(() => store.getters.getPlayerFoundAnswer),
      isTurn: computed(() => store.getters.getIsTurn),
      // isTurn: true, // debug
      currentPlayer: computed(() => store.getters.getCurrentTurnPlayerName),
      guessHint: computed(() => store.getters.getGuessHint),
      currentTime,
      progress,
      hint,
      hintLenCount,
      sendHint,
      canSendHint,
      hintInput,
    };
  },
});
</script>
<style scoped>
.word {
  letter-spacing: 0.2em;
}
/* the regular input with */

.input-custom {
  width: 100%;
  padding-left: 1rem /* 16px */;
  padding-right: 1rem /* 16px */;
}
/* on focus, remove the ring added size, with is 2px per side  */
.input-custom:focus {
  width: calc(100% - 4px);
  margin: 0 auto;
  padding-left: calc(1rem - 2px) /* 16px */;
}

.typing::after {
  content: "";
  animation: typing-dots 1.7s infinite linear;
  transition: all 0.5s;
}

@keyframes typing-dots {
  0% {
    content: "";
  }
  33% {
    content: ".";
  }
  66% {
    content: "..";
  }
  100% {
    content: "...";
  }
}
.animate-throttle {
  animation: load 1s forwards linear;
}
@keyframes load {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
