<template>
  <div class="w-full flex items-stretch">
    <!-- players list -->
    <div class="w-64">Players</div>

    this is the lobby room
  </div>
</template>

<script>
import { computed } from "vue";
export default {
  setup() {
    const height = computed(() => {
      return "1";
    });
    return { height };
  },
};
</script>
