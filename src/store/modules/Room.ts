import { Member } from "./Party";
import { Module, Mutation, VuexModule, Action } from "vuex-module-decorators";
import router from "../../router";
interface RoomCreatedEvent {
  roomId: string;
  gameId: number;
  playerId: string;
  username: string;
}
interface RoomSettings {
  timePerRound: number;
  roundCount: number;
  difficulty: number;
}
interface RoomJoinedEvent {
  roomId: string;
  gameId: number;
  playerId: string;
  party: {
    [key: string]: Member;
  };
  settings?: RoomSettings;
}

@Module
export default class Room extends VuexModule {
  isLobby = true;
  gameId: number | undefined;
  roomId: string | undefined;
  settings: RoomSettings = {
    difficulty: 2,
    timePerRound: 60,
    roundCount: 6,
  };

  get isRoomDataReceived(): boolean {
    return this.gameId !== undefined && this.roomId !== undefined;
  }

  get getIsLobby(): boolean {
    return this.isLobby;
  }

  get getRoomId(): string | undefined {
    return this.roomId;
  }

  get getGameId(): number | undefined {
    return this.gameId;
  }

  get getSettings(): RoomSettings {
    return this.settings;
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
  SET_DIFFICULTY(value: number): void {
    this.settings.difficulty = value;
  }

  @Mutation
  SET_TIME_PER_ROUND(value: number): void {
    this.settings.timePerRound = value;
  }

  @Mutation
  SET_ROUND_COUNT(value: number): void {
    this.settings.roundCount = value;
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

  // recives up successful party join
  @Action
  wsRoomJoined(roomOptions: RoomJoinedEvent) {
    const { gameId, playerId, roomId, party, settings } = roomOptions;
    this.context.commit("SET_GAME_ID", gameId);
    this.context.commit("SET_PLAYER_ID", playerId); // found in party.ts module
    this.context.commit("SET_ROOM_ID", roomId);
    // if settings where provided
    if (settings) {
      const { difficulty, roundCount, timePerRound } = settings;
      this.context.commit("SET_DIFFICULTY", difficulty);
      this.context.commit("SET_TIME_PER_ROUND", timePerRound);
      this.context.commit("SET_ROUND_COUNT", roundCount);
    }
    // set the party with the data given by the server
    this.context.commit("SET_PARTY", { party, playerId });
    router.replace({
      name: "room",
      params: { id: roomId },
    });
  }
  // recived when a new player (other than the current client) joins the party
  @Action
  wsPlayerJoined(data: { event: string; player: Member }) {
    this.context.commit("ADD_PARTY_MEMBER", data.player);
  }
  // recived when a current player leaves the party
  @Action
  wsPlayerLeftParty(data: { playerId: string }) {
    this.context.commit("REMOVE_PARTY_MEMBER", data.playerId);
  }
  // recevied when the creator of the room changes the settings of the room
  @Action
  wsSettingsUpdated(data: { sid: number; value: number }) {
    const { sid, value } = data;
    switch (sid) {
      case 1:
        // difficulty
        this.context.commit("SET_DIFFICULTY", value);
        break;
      case 2:
        // round count
        this.context.commit("SET_ROUND_COUNT", value);

        break;
      case 3:
        // time per round
        this.context.commit("SET_TIME_PER_ROUND", value);
        break;
      default:
        break;
    }
  }
}
