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
          class="px-2 py-1 my-0.25"
          :class="[
            message.type == 1
              ? 'bg-white text-teal-500 '
              : message.type == 3
              ? 'bg-red-100'
              : 'hover:bg-white',
          ]"
        >
          <!--        
            type === 0 => regular message
            type === 1 => has just found correct answer !
            type === 2 => has already found answer 
            type === 3 => rate limiting message
            type === 4 => player disconnected
          -->

          <!-- only display if message type is not 1. 1 = player has found the answer -->

          <!-- MESSAGE FROM -->
          <span v-if="message.type == 3" class="text-red-600 font-bold"
            >wait before sending more messages</span
          >
          <span v-else-if="message.type == 4" class="text-blue-500"
            ><span class="font-bold">{{ message.from }}</span> has
            disconnected</span
          >
          <template v-else>
            <span class="font-bold text-gray-700">{{ message.from }} </span>
            <!-- MESSAGE CONTENT -->
            <!-- If the message type === 1 = player has found correct answer -->
            <span v-if="message.type == 1" class="font-bold">
              <span v-if="message.you"> have </span>
              <span v-else> has </span>found the answer!</span
            >
            <!-- if type = 2 (has already found the answer, change the color), otherwise leave it as default -->
            <span v-else :class="message.type == 2 ? 'text-teal-700' : ''"
              >: {{ message.message }}
            </span>
          </template>
        </div>
      </div>
      <!-- SECTION CHAT INPUT  -->
      <div
        v-if="renderChatInput"
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
import { ChatMessage } from "@/store/modules/Chat";
import { WsClient } from "@/ws/WsClient";
import { computed, defineComponent, inject, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    // const chat = ref<Message[]>([]);
    const chat = (computed(
      () => store.getters.getChat
    ) as unknown) as ChatMessage[];

    const inputMessage = ref("");
    const messageCount = computed(() =>
      inputMessage.value.length <= 999 ? inputMessage.value.length : 999
    );

    const chatRef = ref<HTMLElement | null>(null);
    /**
     * Move the scrollbar of the chat at the very bottom when sending a new message
     */
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
    const ws = inject("ws") as WsClient;
    /**
     * send an answer to the server
     */
    const answer = () => {
      if (!inputMessage.value && inputMessage.value.length > 100) return;
      ws.dispatch.answer(inputMessage.value);
      // scroll the chat to the bottom after sending a message
      scrollChat();
      inputMessage.value = "";
    };

    // if the current game does not feature a turn system, render the chat input without further checks
    const hasTurn = computed<boolean>(() => store.getters.getHasTurns);
    // if not, and if the current client is currently playing, dont render the answer input
    const isTurn = computed<boolean>(() => store.getters.getIsTurn);
    const renderChatInput = computed<boolean>(() => {
      if (!hasTurn.value) {
        return true;
      } else {
        if (isTurn.value) {
          return false;
        } else return true;
      }
    });

    return {
      chat,
      inputMessage,
      messageCount,
      answer,
      renderChatInput,
      chatRef,
    };
  },
});
</script>

<style scoped>
.my-0\.25 {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}
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
