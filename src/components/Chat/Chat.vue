<template>
  <section
    class="flex flex-col w-56 xl:w-60 2xl:w-72 shadow-lg rounded-t-lg overflow-hidden"
  >
    <!-- SECTION CHAT HEADER -->
    <h1
      class="flex items-center text-xl 2xl:text-2xl font-bold bg-gray-900 text-gray-100 h-12 2xl:h-14 pl-3"
    >
      Chat
    </h1>
    <!-- SECTION CHAT BASE -->
    <!-- 200 -->
    <div
      id="chat-display"
      class="flex flex-col justify-end w-full rounded-b-sm h-full bg-gray-200"
    >
      <!-- SECTION CHAT MESSAGES -->
      <div
        id="chat-messages"
        class="flex-grow overflow-y-auto flex flex-col-reverse text-sm 2xl:text-base"
      >
        <div
          v-for="(message, i) in chat.reverse()"
          :key="i"
          class="hover:bg-white px-2 py-1"
        >
          <span class="font-bold text-gray-800">roleqx</span>: {{ i }} -
          {{ message }}
        </div>
      </div>
      <!-- SECTION CHAT INPUT  -->
      <div
        id="chat-input"
        class="h-14 2xl:h-16 px-2 py-2 mt-1 border-t border-gray-500 border-opacity-40 bg-gray-300"
      >
        <!-- INPUT EL  -->
        <input
          placeholder="Type your answer..."
          id="answer-input"
          class="h-full w-full rounded-t-lg border-b-4 border-teal-400 ring-teal-200 pl-2 focus:border-teal-500 bg-gray-100 focus:bg-white text-gray-800 2xl:text-lg"
          @keydown.enter="
            e => {
              chat.push(e.target.value);
              e.target.value = '';
            }
          "
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      chat: [],
    };
  },
});
</script>

<style scoped>
#answer-input:focus {
  animation: flashBorder 0.8s ease-in-out infinite;
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
</style>
