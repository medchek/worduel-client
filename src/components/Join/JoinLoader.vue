<template>
  <div class="w-32 h-32">
    <loader :color="'#14B8A6'" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Loader from "../Loader.vue";

export default defineComponent({
  components: { Loader },
});
</script>
