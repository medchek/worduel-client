<template>
  <div class="flex flex-col w-full lg:w-3/5 h-20 2xl:h-24 text-left mx-auto">
    <input
      placeholder="Enter a nickname"
      :value="value"
      @input="updateValue($event.target.value)"
      class="app-input h-20 2xl:h-24 w-full bg-gray-300 bg-opacity-50 rounded-t-xl border-b-4 border-gray-800 focus:outline-none px-4 text-xl 2xl:text-2xl focus:bg-opacity-100 font-bold ring-teal-100"
    />
    <div
      class="text-red-500 font-semibold text-xs lg:text-sm 2xl:text-base h-10"
    >
      <span class="shake inline-block" v-if="error">{{ error }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    error: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const updateValue = (val: string) => {
      emit("update:value", val.trim());
    };
    return { updateValue };
  },
});
</script>

<style scoped>
.app-input:focus {
  animation: flashBorder 0.8s ease-in-out infinite;
}
.shake {
  animation: shake 0.5s linear forwards;
}
@keyframes flashBorder {
  0% {
    border-color: #2d3748;
  }
  50% {
    border-color: #81e6d9;
  }
  100% {
    border-color: #2d3748;
  }
}
@keyframes shake {
  0% {
    transform: scale(0);
  }
  10% {
    transform: scale(1) translateX(10px);
  }
  20% {
    transform: translateX(-1px);
  }
  40% {
    transform: translateX(7px);
  }
  60% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(7px);
  }
  100% {
    transform: translateX(0);
    color: red;
  }
}
</style>
