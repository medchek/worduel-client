<template>
  <!-- <svg style="width: 24px; height: 24px" viewBox="0 0 24 24"> -->

  <svg :class="className ? className : 'w-5 h-5'" viewBox="0 0 24 24">
    <path fill="currentColor" class="fill-current" :d="icon" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    className: {
      type: String,
    },
    size: {
      type: [Number, String],
      default: 24,
    },
  },
});
</script>
