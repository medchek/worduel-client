<template>
  <div
    class="h-full flex-grow flex items-center relative text-gray-800 mr-18"
    @click="openSelect"
  >
    <input
      :id="id"
      class="select-input pl-6 text-lg font-bold w-full h-full bg-white rounded-lg cursor-pointer ring-teal-200"
      readonly
      :value="options[selectedOptionIndex].value"
      aria-readonly
      aria-expanded="false"
      @keydown.enter="openSelect"
      @keydown.esc="closeSelect"
    />
    <!-- @blur="handleOnBlur" -->
    <div
      class="select-input-arrow top-0 right-2 h-full bg-transparent flex justify-center items-center absolute cursor-pointer pointer-events-none"
    >
      <app-icon :icon="mdiChevronDown" :size="40" ca />
    </div>
  </div>
  <!-- -->
  <select-drop
    @optionSelected="selectOption($event)"
    @closeSelectInput="closeSelect"
    :currentlySelectedIndex="selectedOptionIndex"
    :options="options"
    v-if="show"
  />
</template>

<script>
import { ref, defineAsyncComponent } from "vue";
import { mdiChevronDown } from "@mdi/js";
import { defineComponent } from "vue";

import AppIcon from "../AppIcon";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: false,
      default: null,
    },
    // second pass
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
  components: {
    SelectDrop: defineAsyncComponent(() => import("./SelectDrop.vue")),
    AppIcon,
  },
  setup(props, { emit }) {
    // select options

    const initSelectedOptionIndex = () => {
      const index = props.options.findIndex(
        entry => entry.id === props.defaultSelectedId
      );
      if (index) return index;
      else return 0;
    };
    const selectedOptionIndex = ref(initSelectedOptionIndex());

    const show = ref(false);

    const openSelect = () => {
      show.value = true;
    };
    const closeSelect = () => {
      show.value = false;
    };
    const handleOnBlur = event => {
      // only close the options if the element that triggered the focus loss is not one of the select-options
      // all select-options element have the first class name
      if (event.relatedTarget) {
        if (event.relatedTarget.classList.length > 0) {
          const classList = event.relatedTarget.classList;
          if (classList[0] === "select-option") {
            return;
          }
        }
      }
      show.value = false;
    };
    // used when optionSelected event is triggered
    const selectOption = optionIndex => {
      selectedOptionIndex.value = optionIndex;
      emit("idSelected", props.options[optionIndex].id);
      show.value = false;
    };
    return {
      mdiChevronDown,
      show,
      openSelect,
      closeSelect,
      selectOption,
      selectedOptionIndex,
      handleOnBlur,
    };
  },
});
</script>
