<template>
  <button :disabled="disabled">
    <!-- @click="begin" -->
    <loader v-if="loading" :size="loaderSize" />
    <span v-else><slot></slot></span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loader from "./Loader.vue";

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    loaderSize: {
      type: [String, Number],
      required: false,
      default: "40",
    },
  },
  components: { Loader },
});
</script>
