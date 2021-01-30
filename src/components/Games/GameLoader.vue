<template>
  <div class="flex w-full h-full">
    <loader color="rgba(31, 41, 55)" :size="50"></loader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loader from "@/components/Loader.vue";
export default defineComponent({
  components: { Loader },
});
</script>
