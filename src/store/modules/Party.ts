import { Module, Mutation, VuexModule } from "vuex-module-decorators";

export interface Member {
  id: string;
  username: string;
  score: number;
  isTurn: boolean;
  isLeader: boolean;
}

@Module
export default class Party extends VuexModule {
  party: Map<string, Member> = new Map();
  // the current player id
  playerId: string | undefined;

  get isPartyDataReceived(): boolean {
    return this.party.size > 0 && this.playerId !== undefined;
  }
  get getParty(): Map<string, Member> {
    return this.party;
  }
  get getPlayer(): Member | undefined {
    if (this.playerId) {
      return this.party.get(this.playerId);
    }
    return undefined;
  }

  @Mutation
  SET_PARTY(payload: { party: Map<string, Member>; playerId: string }) {
    const { party, playerId } = payload;
    this.party = party;
    this.playerId = playerId;
  }

  @Mutation
  ADD_PARTY_MEMBER(player: Member) {
    this.party.set(player.id, player);
  }

  @Mutation
  SET_PLAYER_ID(id: string) {
    this.playerId = id;
  }

  @Mutation
  GET_PARTY_MEMBER(playerId: string) {
    return this.party.get(playerId);
  }
}
