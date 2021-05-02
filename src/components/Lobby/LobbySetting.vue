<template>
  <div class="flex flex-col w-full relative mb-5 md:mb-8">
    <div
      class="flex h-18 md:h-14 xl:h-16 w-full flex-col md:flex-row items-start md:items-center"
    >
      <!-- LABEL DIV -->
      <div
        class="text-gray-800 text-base md:text-lg 2xl:text-xl font-bold w-36 md:w-44 lg:w-60"
      >
        <label for="select-game" class="capitalize">{{ label }}</label>
      </div>
      <!-- INPUT -->
      <select-input
        v-if="player.isLeader && sid"
        :options="options"
        :defaultSelectedIndex="defaultSelectedIndex"
        @idSelected="onIdSelected($event)"
        :sid="sid"
        :appendText="appendText"
      ></select-input>
      <select-display :sid="sid" v-else></select-display>
      <!-- SELECT ITEMS -->
    </div>
  </div>
</template>

<script>
import { mdiChevronDown } from "@mdi/js";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import SelectDisplay from "./SelectDisplay.vue";

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
    sid: {
      type: Number,
      required: false,
      default: null,
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
  components: { SelectInput, SelectDisplay },
  computed: {
    ...mapGetters({ player: "getPlayer" }),
  },
  setup(props, { emit }) {
    const onIdSelected = id => {
      emit("idSelected", id);
    };

    return { mdiChevronDown, onIdSelected };
  },
});
</script>
