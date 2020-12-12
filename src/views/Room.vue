<template>
  <div class="w-full flex items-stretch">
    <lobby />
    <!-- players list -->
  </div>
</template>

<script>
import Lobby from "@/components/Lobby/Lobby.vue";
export default {
  setup() {
    console.log("test");
  },
  components: {
    Lobby,
  },
};
</script>
