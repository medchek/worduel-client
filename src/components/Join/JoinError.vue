<template>
  <div
    class="w-full text-center text-3xl md:text-4xl 2xl:text-5xl font-bold mb-20 text-gray-900"
  >
    <p>{{ errorMessage }}</p>
    <router-link
      to="/"
      tag="button"
      class="inline-flex justify-center items-center my-2 bg-teal-400 text-white text-lg md:text-xl h-10 w-24 md:h-12 md:w-32 rounded-md active:bg-bgray-700"
      >home</router-link
    >
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
