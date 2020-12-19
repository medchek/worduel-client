<template>
  <div class="flex flex-col w-full relative mb-8">
    <div class="flex h-12 2xl:h-14 items-center w-full">
      <!-- LABEL DIV -->
      <div class="text-gray-800 text-lg 2xl:text-xl font-bold w-60">
        <label for="select-game" class="capitalize">{{ label }}</label>
      </div>
      <!-- INPUT -->
      <select-input
        :defaultSelectedId="defaultSelectedId"
        :options="options"
        @idSelected="onIdSelected($event)"
      ></select-input>
      <!-- SELECT ITEMS -->
    </div>
  </div>
</template>

<script>
import { mdiChevronDown } from "@mdi/js";
import { defineComponent } from "vue";

import SelectInput from "./SelectInput.vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
      default: "No Label",
    },
    // first pass
    options: {
      type: Object,
      required: true,
    },
    defaultSelectedId: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  emits: ["idSelected"],
  components: { SelectInput },
  setup(props, { emit }) {
    const onIdSelected = id => {
      emit("idSelected", id);
    };
    return { mdiChevronDown, onIdSelected };
  },
});
</script>
