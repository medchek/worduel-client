<template>
  <div class="flex justify-center items-center w-7 h-full">
    <!-- outer circle -->
    <div
      class="flex justify-center items-center w-3 h-3 lg:w-4 lg:h-4 border-2 rounded-full border-gray-800"
    >
      <!-- inner circle -->
      <div
        v-if="displayInnerCircle"
        class="w-2 h-2 rounded-full bg-teal-400"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  props: {
    isTurn: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters({ isLobby: "getIsLobby" }),
    // only display the inner circle out of lobby component and if the isTurn is true
    displayInnerCircle() {
      return !this.isLobby && this.isTurn;
    },
  },
});
</script>
