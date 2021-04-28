<template>
  <div
    id="snackbar"
    class="flex items-center pl-2 lg:pl-5 w-4/5 sm:w-96 xl:w-1/3 h-14 sm:h-16 absolute bottom-4 left-0 right-0 mx-auto font-bold rounded-lg lg:rounded-xl border overflow-hidden shadow-lg text-sm lg:text-base"
    :class="[
      snack.type === 'success'
        ? ' bg-green-200 text-green-600 border-green-300'
        : snack.type == 'info'
        ? 'bg-gray-50 text-gray-900 border-transparent'
        : 'bg-red-200 text-red-600 border-red-300',
    ]"
  >
    <p class="flex-grow">{{ snack.message }}</p>
    <button
      @click="closeSnack"
      id="close-snackbar"
      class="flex items-center justify-center h-full w-14 focus:outline-none text-red-50 hover:text-white cursor-pointer transition-all duration-150"
      :class="[
        snack.type == 'error'
          ? 'bg-red-400 hover:bg-red-600 focus:bg-red-900'
          : 'bg-gray-800 hover:bg-gray-900 focus:bg-gray-800',
      ]"
    >
      <app-icon :icon="mdiCloseCircleOutline" :size="30" />
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mdiCloseCircleOutline } from "@mdi/js";
import AppIcon from "./AppIcon.vue";
import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
  computed: {
    ...mapGetters({
      snack: "getSnack",
    }),
  },
  methods: {
    ...mapMutations({ closeSnack: "CLOSE_SNACK" }),
  },
  setup() {
    return { mdiCloseCircleOutline };
  },
  components: { AppIcon },
});
</script>
