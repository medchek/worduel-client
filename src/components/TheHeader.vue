<template>
  <div
    class="w-full h-12 md:h-12 2xl:h-16 border-b border-gray-100 flex items-center py-1 md:py-0"
  >
    <span
      class="text-gray-800 font-bold text-2xl sm:text-3xl md:text-4xl pl-3 cursor-default select-none"
      >Worduel</span
    >
    <div class="flex-grow"></div>
    <div
      class="flex md:hidden h-full self-end items-center px-2"
      v-if="!isLobby"
    >
      <!-- <a
        href="#"
        class="text-base sm:text-lg font-semibold mr-2 sm:mr-5 text-gray-900 hover:text-teal-600"
        >Game list</a
      >
      <a
        href="#"
        class="text-base sm:text-lg font-semibold mr-2 sm:mr-5 text-gray-900 hover:text-teal-600"
        >How to play</a
      > -->
      <button
        class="shadow-sm bg-gray-100 300 w-8 h-8 text-bgray-600 rounded active:bg-bgray-700 active:text-white mr-2 ring-teal-200"
        @click="toggleParty"
      >
        <app-icon :icon="mdiAccountGroup" :size="20" />
      </button>
      <button
        class="shadow-sm bg-gray-100 300 w-8 h-8 text-bgray-600 rounded active:bg-bgray-700 active:text-white ring-teal-200"
        @click="toggleChat"
      >
        <app-icon :icon="mdiChat" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mdiAccountGroup, mdiChat } from "@mdi/js";
import AppIcon from "@/components/AppIcon.vue";

import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
  components: {
    AppIcon,
  },
  computed: {
    ...mapGetters({
      isLobby: "getIsLobby",
    }),
  },
  methods: {
    ...mapMutations({
      toggleParty: "TOGGLE_PARTY",
      toggleChat: "TOGGLE_CHAT",
    }),
  },
  setup() {
    return { mdiAccountGroup, mdiChat };
  },
});
</script>
