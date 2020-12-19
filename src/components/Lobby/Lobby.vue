<template>
  <party />
  <lobby-settings-panel />
</template>

<script>
import { defineComponent } from "vue";
import Party from "../Party/Party.vue";
import LobbySettingsPanel from "./LobbySettingsPanel.vue";
export default defineComponent({
  components: {
    Party,
    LobbySettingsPanel,
  },
});
</script>
