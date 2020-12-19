import { Member } from "./Party";
import { Module, Mutation, VuexModule, Action } from "vuex-module-decorators";
import router from "../../router";
interface RoomCreatedEvent {
  roomId: string;
  gameId: number;
  playerId: string;
  username: string;
}

@Module
export default class Room extends VuexModule {
  isLobby = true;
  gameId: number | undefined;
  roomId: string | undefined;
  roundCount = 5;
  currentRound = 1;

  get isRoomDataReceived(): boolean {
    return this.gameId !== undefined && this.roomId !== undefined;
  }

  get getIsLobby(): boolean {
    return this.isLobby;
  }

  @Mutation
  SET_ROOM_ID(id: string) {
    this.roomId = id;
  }

  @Mutation
  SET_GAME_ID(id: number) {
    this.gameId = id;
  }

  @Mutation
  SET_ROUND_COUNT(count: number) {
    this.roundCount = count;
  }

  @Mutation
  SET_CURRENT_ROUND(round: number) {
    this.currentRound = round;
  }

  @Action
  wsRoomCreated(roomOptions: RoomCreatedEvent) {
    const { gameId, playerId, roomId, username } = roomOptions;
    this.context.commit("SET_GAME_ID", gameId);
    this.context.commit("SET_PLAYER_ID", playerId); // found in party.ts module
    this.context.commit("SET_ROOM_ID", roomId);
    // when everything is set, redirect the user to the room component
    // initially, a members property has been sent by the server in order to set the party members
    // but since this is a newly created room, the only person present in it should be the one who requested it
    // therefore, add the (current) client to the party memebers with the default values
    // ? note: When joining a room however, the server will send the whole party members instead.
    const member: Member = {
      id: playerId,
      isLeader: true, // the one who created the room
      isTurn: true, // first present, first to play
      score: 0, // intially at 0
      username,
    };
    this.context.commit("ADD_PARTY_MEMBER", member);

    router.replace({
      name: "room",
      params: { id: roomId },
    });
  }
}
