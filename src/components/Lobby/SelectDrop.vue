<template>
  <div
    id="drop-down"
    ref="selectDropRef"
    class="absolute z-50 max-h-60 overflow-y-auto left-0 right-0 bg-white shadow-xl rounded-t-lg rounded-b-md flex flex-col text-gray-800"
    :class="[isOutOfScreen ? 'bottom-0' : 'top-0']"
  >
    <select-option
      v-for="(option, index) in options"
      :key="option.id"
      @click="emitSelectedOption(index)"
      @keydown.enter="emitSelectedOption(index)"
      >{{ option.value }}</select-option
    >
  </div>
</template>

<script>
import { defineComponent, onUnmounted, ref, onMounted } from "vue";
import SelectOption from "./SelectOption.vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    // to prevent triggering the select event when the same value is selected over and over
    currentlySelectedIndex: {
      type: Number,
      required: true,
    },
    // use
    options: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectDropRef = ref(null);

    const onSelectDropClickOutside = event => {
      // if the clicked element is this component
      if (event.target.isEqualNode(selectDropRef.value)) {
        // don't do anything, as ill
        return;
      } else {
        // close the input
        emit("closeSelectInput");
      }
    };

    const isOutOfScreen = ref(false);

    const emitSelectedOption = optionIndex => {
      // if the same option was selected again, return
      if (optionIndex === props.currentlySelectedIndex) return;
      emit("optionSelected", optionIndex);
    };

    onMounted(() => {
      // the settimeout will prevent the click outside event from removing the component right after render
      const show = setTimeout(() => {
        document.addEventListener("click", onSelectDropClickOutside);
        clearTimeout(show);
      }, 10);
      if (
        selectDropRef.value.getBoundingClientRect().bottom >
        document.body.clientHeight
      ) {
        isOutOfScreen.value = true;
      }
    });
    onUnmounted(() => {
      document.removeEventListener("click", onSelectDropClickOutside);
    });
    return { emitSelectedOption, selectDropRef, isOutOfScreen };
  },
  components: { SelectOption },
});
</script>
