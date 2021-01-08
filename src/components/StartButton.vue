<template>
  <button
    class="flex justify-center items-center mt-5 2xl:mt-10 mb-4 w-1/3 h-16 mx-auto text-gray-100 rounded-lg font-bold text-2xl shadow-sm hover:shadow-lg transition-all duration-200 focus:shadow-inner focus:bg-black focus:outline-none"
    :class="[isBeginLoading ? 'bg-gray-700' : 'bg-gray-900  hover:bg-gray-800']"
    :disabled="isBeginLoading"
  >
    <!-- @click="begin" -->
    <loader v-if="isBeginLoading" size="40" />
    <span v-else><slot></slot></span>
  </button>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import Loader from "./Loader";

export default defineComponent({
  components: { Loader },
  computed: {
    ...mapGetters({
      isBeginLoading: "getIsBeginLoading",
    }),
  },
});
</script>
