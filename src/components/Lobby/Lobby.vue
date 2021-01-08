<template>
  <party />
  <lobby-settings-panel />
</template>

<script>
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import Party from "../Party/Party.vue";
import LobbySettingsPanel from "./LobbySettingsPanel.vue";
export default defineComponent({
  components: {
    Party,
    LobbySettingsPanel,
  },
  methods: {
    ...mapMutations({ setIsBeginLoading: "SET_IS_BEGIN_LOADING" }),
  },
  created() {
    this.setIsBeginLoading(false);
  },
});
</script>
