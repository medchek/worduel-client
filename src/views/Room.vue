<template>
  <div
    v-if="isLobby"
    class="w-full flex flex-col flex-grow h-full md:flex-row md:items-stretch md:my-2 md:px-2 justify-between"
  >
    <!-- <lobby v-if="isLobby" /> -->
    <lobby />
    <!-- players list -->
  </div>
  <game v-else />
</template>

<script lang="ts">
import Lobby from "@/components/Lobby/Lobby.vue";
import { defineAsyncComponent, defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  computed: {
    ...mapGetters({ isLobby: "getIsLobby" }),
  },
  components: {
    Lobby,
    Game: defineAsyncComponent(() => import("@/views/Game.vue")),
  },
});
</script>
