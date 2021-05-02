<template>
  <section
    v-show="showParty"
    id="party-base"
    class="flex flex-col w-full h-auto md:h-full md:w-48 xl:w-60 2xl:w-72 md:shadow-lg md:rounded-t-lg overflow-hidden md:border-none mb-2 md:mb-0 relative"
    :class="[
      // if the ui is sm or smaller, and the ui is not in the lobby, remove the border radius
      !isLobby ? 'rounded-lg border-2' : 'rounded-none border-b-2',
    ]"
  >
    <!-- <h1 class="w-20 bg-red-500 absolute left-10 -top-5">pary</h1> -->
    <!-- HEADER -->
    <h1
      class="flex items-center pl-1 md:pl-3 text-lg md:text-xl 2xl:text-2xl font-bold bg-teal-400 text-white h-6 md:h-10 lg:h-12 2xl:h-14"
    >
      Party
    </h1>
    <!-- BASE -->
    <div
      id="party-display"
      class="flex items-center w-auto h-auto md:h-full md:w-full py-2 md:py-0 overflow-x-auto"
    >
      <div
        id="party-display-scroller"
        class="inline-flex w-auto md:w-full flex-row md:flex-col md:justify-start md:border border-t-0 border-gray-200 rounded-b-sm h-full px-2"
      >
        <player v-for="player in party" :key="player.id" :player="player" />
      </div>
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
      isLobby: "getIsLobby",
      showParty: "getShowParty",
    }),
  },
  components: {
    Player,
  },
});
</script>
