<template>
  <div
    class="w-full text-center text-4xl 2xl:text-5xl font-bold mb-20 text-gray-900"
  >
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
});
</script>
