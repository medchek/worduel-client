<template>
  <!-- CREDIT: https://codepen.io/jczimm/pen/vEBpoL -->
  <span class="loader" :style="{ width: `${size}px` }">
    <svg class="circular" viewBox="25 25 50 50">
      <circle
        class="path"
        :style="{ stroke: color }"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        :stroke-width="thickness"
        stroke-miterlimit="10"
      />
    </svg>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    size: {
      type: [String, Number],
      default: "20",
    },
    thickness: {
      type: Number,
      default: 4,
    },
    color: {
      type: String,
      default: "white",
    },
  },
});
</script>

<style scoped>
/* SPINNER ANIMATION FROM https://codepen.io/jczimm/pen/vEBpoL */
.loader {
  position: relative;
  margin: 0 auto;
  /* width: 50px; */
}
.loader::before {
  content: "";
  display: block;
}
.circular {
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  margin: auto;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
  /* stroke: white; */
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
