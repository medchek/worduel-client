<template>
  <!-- removed flex-1 and gave it a height.  -->
  <!-- Reminder: flex-1 expands the flex column height evenly  -->
  <button
    class="select-option justify-start h-14 hover:bg-gray-300 text-lg focus:ring-0 focus:bg-teal-500 focus:text-white pl-6 w-full font-bold capitalize"
  >
    <slot></slot>
  </button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({});
</script>
