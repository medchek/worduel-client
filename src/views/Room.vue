<template>
  <div class="w-full flex items-stretch my-3 px-2 justify-between">
    <lobby v-if="isLobby" />
    <!-- players list -->
    <game v-else />
  </div>
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
