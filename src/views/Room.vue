<template>
  <div class="w-full flex items-stretch my-3 px-2">
    <lobby />
    <!-- players list -->
  </div>
</template>

<script>
import Lobby from "@/components/Lobby/Lobby.vue";
export default {
  setup() {
    // room
  },
  components: {
    Lobby,
  },
};
</script>
