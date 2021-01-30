<template>
  <!-- <svg style="width: 24px; height: 24px" viewBox="0 0 24 24"> -->
  <svg :style="{ width: `${size}px`, height: `${size}px` }" viewBox="0 0 24 24">
    <path fill="#000" class="fill-current" :d="icon" />
  </svg>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 24,
    },
  },
});
</script>
