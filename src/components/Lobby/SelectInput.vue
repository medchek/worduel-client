<template>
  <div
    class="h-full flex-grow flex items-center relative text-gray-800 mr-18"
    @click="openSelect"
  >
    <input
      :id="id"
      class="select-input pl-6 text-lg font-bold w-full h-full bg-white rounded-lg cursor-pointer ring-teal-200"
      readonly
      :value="completeDisplayValue"
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
    :currentlySelectedIndex="currentlySelectedIndex"
    :options="options"
    v-if="show"
  />
</template>

<script>
import { ref, defineAsyncComponent, computed } from "vue";
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
    sid: {
      type: Number,
    },
    // second pass
    options: {
      type: Array,
      required: true,
    },
    defaultSelectedIndex: {
      type: Number,
      required: false,
      default: 0,
    },
    appendText: {
      type: String,
      required: false,
    },
  },
  emits: ["idSelected"],
  components: {
    SelectDrop: defineAsyncComponent(() => import("./SelectDrop.vue")),
    AppIcon,
  },
  setup(props, { emit }) {
    // select options

    const show = ref(false);

    const openSelect = () => {
      show.value = true;
    };
    const closeSelect = () => {
      show.value = false;
    };

    // initial value is the default selected index
    // will updated when optionSelected event is triggered
    const currentlySelectedIndex = ref(props.defaultSelectedIndex);
    // the display value of the input
    const displayValue = ref(props.options[props.defaultSelectedIndex].value);

    // used when optionSelected event is triggered
    const selectOption = optionIndex => {
      // set the new display value
      displayValue.value = props.options[optionIndex].value;
      // set the new currently selected index
      currentlySelectedIndex.value = optionIndex;
      // emit parent component
      emit("idSelected", props.options[optionIndex].id);
      show.value = false;
    };
    // display value + appendText (if any)
    const completeDisplayValue = computed(() => {
      if (props.appendText) {
        return displayValue.value + ` ${props.appendText}`;
      } else {
        return displayValue.value;
      }
    });
    return {
      mdiChevronDown,
      show,
      openSelect,
      closeSelect,
      selectOption,
      completeDisplayValue,
      currentlySelectedIndex,
    };
  },
});
</script>
