<template>
  <section
    class="flex flex-col w-56 xl:w-72 2xl:w-80 shadow-lg rounded-t-lg overflow-hidden"
  >
    <h1
      class="flex items-center pl-3 text-xl 2xl:text-2xl font-bold bg-teal-400 text-white h-12 2xl:h-16"
    >
      Party
    </h1>
    <div
      id="party-display"
      class="w-full border border-t-0 border-gray-200 rounded-b-sm h-full"
    >
      <player v-for="player in party" :key="player.id" :player="player" />
    </div>
    <!-- PLAYERS -->
  </section>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import Player from "./Player.vue";

export default defineComponent({
  computed: {
    ...mapGetters({
      party: "getParty",
    }),
  },
  components: {
    Player,
  },
});
</script>
