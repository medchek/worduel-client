import { Module, Mutation, VuexModule } from "vuex-module-decorators";
export interface Member {
  id: string;
  username: string;
  score: number;
  isTurn: boolean;
  isLeader: boolean;
}

export interface Members {
  [playerId: string]: Member;
}

@Module
export default class Party extends VuexModule {
  party: Members = {};
  // the current player id
  playerId: string | undefined;

  get isPartyDataReceived(): boolean {
    return Object.keys(this.party).length > 0;
  }
  get getParty(): Members {
    return this.party;
  }
  get getPlayer(): Member | undefined {
    return this.playerId ? this.party[this.playerId] : undefined;
  }

  @Mutation
  SET_PARTY(payload: { party: Members; playerId: string }) {
    const { party, playerId } = payload;
    this.party = party;
    this.playerId = playerId;
  }

  @Mutation
  ADD_PARTY_MEMBER(player: Member) {
    this.party[player.id] = player;
  }

  @Mutation
  SET_PLAYER_ID(id: string) {
    this.playerId = id;
  }

  @Mutation
  GET_PARTY_MEMBER(playerId: string) {
    return this.party[playerId];
  }
}