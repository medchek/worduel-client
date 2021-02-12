import { Module, Mutation, VuexModule } from "vuex-module-decorators";
import { RoundScore } from "./Room";
export interface Member {
  id: string;
  username: string;
  score: number;
  isTurn: boolean;
  isLeader: boolean;
  foundAnswer?: boolean;
}

export interface Members {
  [playerId: string]: Member;
}

@Module
export default class Party extends VuexModule {
  party: Members = {};
  /** the current player id */
  playerId: string | undefined;
  /** State used to tell whether the player has found the correct answer */
  playerFoundAnswer = false;

  get isPartyDataReceived(): boolean {
    return Object.keys(this.party).length > 0;
  }
  get getPlayerName(): string | undefined {
    if (this.playerId) return this.party[this.playerId].username;
    else return undefined;
  }
  get getParty(): Members {
    return this.party;
  }
  get getPlayer(): Member | undefined {
    return this.playerId ? this.party[this.playerId] : undefined;
  }
  get getPlayerId(): string | undefined {
    return this.playerId;
  }

  get getPartyLength(): number {
    return Object.keys(this.party).length;
  }

  get getPlayerFoundAnswer(): boolean {
    return this.playerFoundAnswer;
  }

  @Mutation
  SET_PARTY(payload: { party: Members; playerId: string }) {
    const { party, playerId } = payload;
    this.party = party;
    this.playerId = playerId;
  }

  @Mutation
  SET_NEW_LEADER(newLeaderId: string): void {
    if (Object.keys(this.party).includes(newLeaderId)) {
      this.party[newLeaderId].isLeader = true;
    }
  }

  @Mutation
  ADD_PARTY_MEMBER(player: Member) {
    this.party[player.id] = player;
  }
  @Mutation
  REMOVE_PARTY_MEMBER(playerId: string) {
    delete this.party[playerId];
  }

  @Mutation
  SET_PLAYER_ID(id: string) {
    this.playerId = id;
  }

  @Mutation
  GET_PARTY_MEMBER(playerId: string): Member {
    return this.party[playerId];
  }

  @Mutation
  SET_PLAYER_FOUND_ANSWER() {
    this.playerFoundAnswer = true;
  }

  @Mutation
  SET_PARTY_MEMBER_FOUND_ANSWER(playerId: string) {
    this.party[playerId].foundAnswer = true;
  }

  @Mutation
  RESET_PLAYER_FOUND_ANSWER() {
    this.playerFoundAnswer = false;
  }

  @Mutation
  RESET_PARTY_FOUND_ANSWER() {
    for (const playerId in this.party) {
      if (this.party[playerId].foundAnswer)
        this.party[playerId].foundAnswer = false;
    }
  }

  @Mutation
  INCREMENT_PLAYERS_SCORE(scores: RoundScore) {
    for (const [playerId, score] of Object.entries(scores)) {
      this.party[playerId].score += score;
    }
  }

  /** RESET THE PART MODULE BACK TO ITS DEFAULT STATE */
  @Mutation
  RESET_ALL_PARTY(): void {
    this.party = {};
    this.playerId = undefined;
    this.playerFoundAnswer = false;
  }
}
