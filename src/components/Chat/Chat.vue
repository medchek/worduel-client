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
        ref="chatRef"
        class="flex-grow overflow-y-auto flex flex-col-reverse text-sm 2xl:text-base"
      >
        <div
          v-for="message in chat"
          :key="message.id"
          class="hover:bg-white px-2 py-1"
        >
          <span class="font-bold text-gray-800">roleqx</span>:
          {{ message.message }}
        </div>
      </div>
      <!-- SECTION CHAT INPUT  -->
      <div
        id="chat-input"
        class="h-18 2xl:h-18 px-2 pt-2 mt-1 border-t border-gray-500 border-opacity-40 bg-gray-300"
      >
        <!-- INPUT EL  -->
        <form @submit.prevent="answer">
          <input
            v-model="inputMessage"
            placeholder="Type your answer..."
            maxlength="100"
            spellcheck="false"
            autocomplete="off"
            id="answer-input"
            class="h-12 2xl:h-12 w-full rounded-t-lg border-b-4 border-teal-400 ring-teal-200 pl-2 focus:border-teal-500 bg-gray-100 focus:bg-white text-gray-800 2xl:text-lg"
          />
          <div
            class="h-4 text-xs text-right text-gray-600"
            :class="[
              messageCount <= 100 ? 'text-gray-600' : 'text-red-500 font-bold',
            ]"
          >
            {{ messageCount }}/100
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

interface Message {
  message: string;
  id: number;
}
export default defineComponent({
  setup() {
    const chat = ref<Message[]>([]);
    const inputMessage = ref("");
    const messageCount = computed(() =>
      inputMessage.value.length <= 999 ? inputMessage.value.length : 999
    );

    const chatRef = ref<HTMLElement | null>(null);

    const scrollChat = () => {
      // scroll back to the bottom upon sending a new message
      if (chatRef.value) {
        const chatEl = chatRef.value;
        // only scroll if there is a scrollbar
        if (chatEl.scrollHeight > chatEl.clientHeight) {
          // only scroll if the scroll bar is not all the way to the bottom upon sending a message
          if (chatEl.scrollTop != 0) {
            chatEl.scrollTop = 0;
          }
        }
      }
    };
    const answer = () => {
      if (!inputMessage.value) return;
      // emulate latency
      setTimeout(() => {
        chat.value.unshift({ message: inputMessage.value, id: Date.now() });
        scrollChat();
        inputMessage.value = "";
      }, 100);
    };

    return { chat, inputMessage, messageCount, answer, chatRef };
  },
});
</script>

<style scoped>
#chat-messages {
  flex: 1 1 auto;
  height: 0;
}

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
