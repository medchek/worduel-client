import { Module, Mutation, VuexModule, Action } from "vuex-module-decorators";
// mocks
// import { chat } from "./../../__tests__/mocks/store";
export interface ChatMessage extends MessageData {
  id: number;
}
interface MessageData {
  playerId?: string; // used to uniquely identify the player that found the correct answer and display the check mark and stop the timer for him/her
  from?: string; // player id
  message?: string; // if the type number is 1, the message property is undefined and is always "playerid has found the answer",
  type: number; // undefined = regular. 1 = just found correct answer, 2 = already answered, 3 = rate limiter slow down, 4 = player has disconnected
}

@Module
export default class Party extends VuexModule {
  // chat: ChatMessage[] = [...chat];
  chat: ChatMessage[] = [];

  get getChat(): ChatMessage[] {
    return this.chat;
  }

  /**
   * Add a message to the chat
   * @param message the message data to add to the chat
   */
  @Mutation
  ADD_MESSAGE(message: MessageData): void {
    this.chat.unshift({ id: Date.now(), ...message });
  }

  /** REST THE CHAT MODULES TO ITS DEFAULT STATE */
  @Mutation
  RESET_ALL_CHAT(): void {
    this.chat = [];
  }

  /**
   * event received when the server sends a chat message
   * @param message the message data
   */
  @Action
  wsChatMessageReceived(messageData: MessageData) {
    // if a player has found the correct answer
    // set the party member as having found the answer
    if (messageData.type === 1) {
      this.context.commit(
        "SET_PARTY_MEMBER_FOUND_ANSWER",
        messageData.playerId
      );
    }
    this.context.commit("ADD_MESSAGE", { ...messageData, you: false });
  }

  @Action
  wsCorrectAnswer({ message }: { message: string }) {
    // stop the timer count down when the player finds the correct answer
    this.context.commit("STOP_TIMER");
    // set the player as having found the answer to display the check mark
    this.context.commit("SET_PLAYER_FOUND_ANSWER");
    // reveal the correct answer instead of the shuffled word
    this.context.commit("SET_WORD", message);
    // apply the changes to the party aswell using the current client's id
    this.context.commit(
      "SET_PARTY_MEMBER_FOUND_ANSWER",
      this.context.getters.getPlayerId
    );
    // add a chat message as well
    this.context.commit("ADD_MESSAGE", {
      from: "You",
      // used to display "you have found the answer" instead of a "playername has found the answer" for the current client
      you: true,
      type: 1, // undefined = regular. 1 = just found correct answer, 2 = already answered, 3 = rate limiter slow down
    });
  }

  @Action
  wsChatSlowDown() {
    this.context.commit("ADD_MESSAGE", {
      type: 3,
    });
  }
}
