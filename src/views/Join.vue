<template>
  <section class="w-full flex my-3 px-2 flex-col items-center justify-center">
    <component
      :is="componentToLoad"
      v-bind="{ errorMessage: errorMessage }"
    ></component>
  </section>
</template>

<script lang="ts">
import { ref } from "vue";
import axios from "axios";

import JoinError from "@/components/Join/JoinError.vue";
import JoinLoader from "@/components/Join/JoinLoader.vue";
import JoinPanel from "@/components/Join/JoinPanel.vue";

import { defineComponent } from "vue";
import { useRoute } from "vue-router";

import { server } from "../config/settings";

export default defineComponent({
  components: {
    JoinLoader,
    JoinError,
    JoinPanel,
  },
  setup() {
    const route = useRoute();
    const componentToLoad = ref("JoinLoader");
    const errorMessage = ref("");
    // check if param.roomId exists
    axios
      .get(
        `${server.protocol}://${server.host}${
          server.port ? `:${server.port}` : ""
        }/join/${route.params.roomId}`
      )
      .then(() => {
        // the resolve respose will always be 200, no further information is received
        componentToLoad.value = "joinPanel";
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 403) {
            errorMessage.value = "Sorry, but this room is already full :'(";
          } else if (err.response.status === 404) {
            errorMessage.value = "Sorry, this room does not exist :(";
          } else if (err.response.status === 429) {
            errorMessage.value =
              "You have sent too many room join requests in a short time, try back later.";
          } else {
            errorMessage.value =
              "Could not complete your request, please try back later.";
          }
        }
        componentToLoad.value = "joinError";
      });

    return { componentToLoad, errorMessage };
  },
});
</script>
