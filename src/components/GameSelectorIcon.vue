<template>
  <button
    class="flex justify-center items-center w-28 h-28 2xl:w-40 2xl:h-40 bg-teal-500 font-bold text-3xl mx-3 rounded-3xl text-gray-100 shadow-lg"
  >
    {{ name }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    gameName: {
      type: String,
      required: true,
    },
    gameId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return {
      name: props.gameName,
      id: props.gameId,
    };
  },
});
</script>
