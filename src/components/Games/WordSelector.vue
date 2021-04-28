<template>
  <div
    id="word-selector"
    class="flex flex-col justify-center items-center flex-grow w-11/12 relative"
  >
    <section
      class="w-full h-52 xl:h-64 bg-tgray-50 flex flex-col justify-center items-center rounded-t-lg text-bgray-800 px-2"
    >
      <div class="w-full text-center" v-if="isTurn">
        <h2 class="text-2xl">Select a guess word among the following</h2>
        <div class="w-full flex justify-center justify-self-center my-5">
          <button
            class="bg-teal-400 text-white w-36 h-12 xl:w-44 xl:h-14 2xl:w-52 2xl:h-16 font-bold text-2xl 2xl:text-3xl rounded-lg mx-2 xl:mx-5 hover:bg-teal-300 focus:bg-teal-500 focus:ring-teal-200 transition-all"
            :class="{
              'bg-tgray-300 hover:bg-tgray-300':
                !canSelect && index !== selectedIndex,
            }"
            v-for="(word, index) in hintWords"
            :key="word"
            @click="selectHintWord(index)"
            :disabled="!canSelect"
          >
            <Loader size="35" v-if="!canSelect && index === selectedIndex" />
            <span v-else>{{ word }}</span>
          </button>
        </div>
      </div>
      <p
        class="text-2xl xl:text-3xl 2xl:text-4xl text-bgray-600 text-center"
        v-else
      >
        <span class="text-teal-400 font-ita"> {{ currentPlayer }} </span> is
        selecting a word...
      </p>
    </section>
    <div
      id="select-timer"
      class="bg-tgray-300 w-full h-4 rounded-b relative overflow-hidden"
    >
      <div
        class="progress absolute h-full bg-teal-400 z-10 transition-all"
        :class="{ 'animation-pause': !canSelect }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import {
  computed,
  defineComponent,
  defineAsyncComponent,
  ref,
  inject,
} from "vue";
import { WsClient } from "@/ws/WsClient";
export default defineComponent({
  components: {
    Loader: defineAsyncComponent(() => import("@/components/Loader.vue")),
  },
  setup() {
    const store = useStore();
    const hintWords = computed(() => store.getters.getWordList);
    const canSelect = ref<boolean>(true);
    // used to display the loader in the apporiate button
    const selectedIndex = ref<number | null>(null);

    const ws = inject("ws") as WsClient;
    const selectHintWord = (index: number) => {
      // affects whether the player can click on the buttons to select
      canSelect.value = false;
      // set the word to as the guess word to display it for the current player
      store.commit("SET_WORD", hintWords.value[index]);
      // set it to track which button got clicked among the three rendered
      selectedIndex.value = index;
      ws.dispatch.wordSelected(index);
    };

    return {
      selectHintWord,
      currentPlayer: computed(() => store.getters.getCurrentTurnPlayerName),
      hintWords,
      // hintWords,
      canSelect,
      selectedIndex,
      isTurn: computed(() => store.getters.getIsTurn),
    };
  },
});
</script>

<style scoped>
.progress {
  animation: progress-transition forwards linear 11s;
}

.animation-pause {
  animation-play-state: paused;
}

@keyframes progress-transition {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
