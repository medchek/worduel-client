<template>
  <div class="flex flex-col w-full h-14 sm:h-26 md:h-18 mx-auto">
    <input
      :placeholder="placeholder"
      :spellcheck="spellcheck"
      :autofocus="autofocus"
      :value="value"
      @input="updateValue($event.target.value)"
      class="flex-grow w-full rounded-t-xl border-b-4 2xl:border-b-6 focus:outline-none px-4 text-xl sm:text-2xl 2xl:text-3xl font-bold"
      :class="[
        error
          ? 'border-red-600 app-input-error ring-red-200'
          : 'border-gray-800 app-input  ring-teal-200',
        className ? className : 'bg-gray-100 focus:bg-gray-50',
      ]"
    />
  </div>
  <div
    v-if="!noError"
    class="text-left text-red-600 font-bold text-xs md:text-sm 2xl:text-base bg-red-100 mt-1 rounded py-1 px-2"
    :class="{ hidden: !error }"
  >
    <span class="shake inline-block" v-if="error">{{ error }}</span>
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
    className: {
      type: String,
    },
    error: {
      type: String,
      default: "",
    },
    noError: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    spellcheck: {
      type: [Boolean, String],
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
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
.app-input-error:focus {
  animation: flashBorderError 0.8s ease-in-out infinite;
}
@keyframes flashBorderError {
  0% {
    border-color: #7f1d1d;
  }
  50% {
    border-color: #ef4444;
  }
  100% {
    border-color: #7f1d1d;
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
  }
}
</style>
