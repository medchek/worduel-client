import { Module, Mutation, VuexModule } from "vuex-module-decorators";

// data received from the server
export interface RiddleData {
  riddle: string;
  wordLen: number;
}

@Module({ name: "riddlesModule" })
export default class Riddles extends VuexModule {
  riddle = "";
  riddleAnswerLength = 0;

  get getRiddle(): string {
    return this.riddle;
  }

  get getRiddleAnswerLength(): number {
    return this.riddleAnswerLength;
  }

  @Mutation
  SET_RIDDLE(riddleContent: RiddleData) {
    // console.log("SET_RIDDLE OBJECT", riddle);
    this.riddle = riddleContent.riddle;
    this.riddleAnswerLength = riddleContent.wordLen;
  }
}
