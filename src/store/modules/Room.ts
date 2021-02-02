import { Member, Members } from "./Party";
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
  // if game has started
  word?: string;
  roundPhase?: number; // 1 = before timer start,2 = during round when timer is started, 3 = on roud end/score announcing phase
  remainingTime?: number;
  round?: number;
  scores?: { [payerId: string]: number };
}

export interface RoundScore {
  [playerName: string]: number;
}
export interface PlayerScore {
  id: string;
  username: string;
  score: number;
}

@Module
export default class Room extends VuexModule {
  isLobby = true;
  gameId: number | undefined = undefined;
  roomId: string | undefined = undefined;
  settings: RoomSettings = {
    difficulty: 2,
    timePerRound: 60,
    roundCount: 6,
  };
  timer: number | null = null;
  // base value is the total time per round
  currentTime = this.settings.timePerRound;
  currentRound = 0;
  roundScore: PlayerScore[] | null = null;

  // word recived from the server that corresponds to the current word to be guessed
  word = "";
  // the component to load in the game room. (RoundAnnouncer, GameComponentName, or ScoreAnnouncer)
  component = "RoundAnnouncer";
  // component = "ScoreAnnouncer"; // ! FIXME REMOVE THIS AFTER TESTING

  gameEnded = false;

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

  get getTimePerRound(): number {
    return this.settings.timePerRound;
  }

  get getCurrentTime(): number {
    return this.currentTime;
  }
  get getCurrentRound(): number {
    return this.currentRound;
  }

  get getWord(): string {
    return this.word;
  }

  get getRoundScore(): PlayerScore[] | null {
    return this.roundScore;
  }

  get getGameEnded(): boolean {
    return this.gameEnded;
  }

  /**
   * Returns the game component name based on the gameId.
   * Defaults to Shuffler
   */
  get getGameComponentName(): string {
    return this.gameId == 1
      ? "Shuffler"
      : this.gameId == 2
      ? "Guess" // placeholder
      : this.gameId == 3
      ? "Chance" // placeholder
      : "Shuffler"; // default
  }

  get getRoomComponent(): string {
    return this.component;
  }

  get getFinalScores(): PlayerScore[] {
    const party: Members = this.context.rootGetters.getParty;
    const scores: PlayerScore[] = [];
    for (const player in party) {
      scores.push({
        id: party[player].id,
        username: party[player].username,
        score: party[player].score,
      });
    }
    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * When isLobby is false, the game view is loaded
   * @param isLobby a boolean
   */
  @Mutation
  SET_IS_LOBBY(isLobby: boolean) {
    this.isLobby = isLobby;
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
    this.currentTime = value;
  }

  @Mutation
  SET_ROUND_COUNT(value: number): void {
    this.settings.roundCount = value;
  }

  @Mutation
  SET_REMAINING_TIME(seconds: number) {
    this.currentTime = seconds;
  }

  @Mutation
  SET_IS_NOT_LOBBY(): void {
    this.isLobby = false;
  }

  @Mutation
  NEXT_ROUND(): void {
    this.currentRound++;
  }
  @Mutation
  SET_ROUND(round: number): void {
    this.currentRound = round;
  }

  @Mutation
  START_TIMER(): void {
    this.timer = setInterval(() => {
      this.currentTime--;
      if (this.currentTime == 0) {
        if (this.timer) clearInterval(this.timer);
        console.log("timer stopped");
      }
      // console.log("timer is = ", this.currentTime);
    }, 1000);
  }

  @Mutation
  STOP_TIMER(): void {
    if (this.timer) clearInterval(this.timer);
  }

  @Mutation
  SET_WORD(word: string): void {
    this.word = word;
  }

  @Mutation
  SET_GAME_COMPONENT(componentName: string): void {
    this.component = componentName;
  }

  @Mutation
  SET_ROUND_SCORE(scores: PlayerScore[]): void {
    this.roundScore = scores;
  }

  /** Reset the whole round related data, to prepare for the next round */
  @Mutation
  RESET_ROUND_STATE(): void {
    // nullify the timer state
    this.timer = null;
    // reset the round timer
    this.currentTime = this.settings.timePerRound;
  }

  @Mutation
  RESET_ROUND_SCORE(): void {
    this.roundScore = null;
  }

  @Mutation
  SET_GAME_ENDED(ended = true) {
    this.gameEnded = ended;
  }

  // ACTIONS

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
    const {
      gameId,
      playerId,
      roomId,
      party,
      settings,
      remainingTime,
      roundPhase,
      word,
      round,
      scores,
    } = roomOptions;

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
    // if the roudPhase is includes in the data, the game has already started
    if (roundPhase) {
      // display the Game view
      this.context.commit("SET_IS_LOBBY", false);
      // set the word to guess
      this.context.commit("SET_WORD", word);
      // only increment the round if it wasnt set yet
      if (this.context.getters.getCurrentRound == 0) {
        this.context.commit("SET_ROUND", round);
      }
      // depending on the phase, load different components
      // phase 1 = RoundAnnouncer which is set by default, hence not changing it

      // if the round is ongoing
      if (roundPhase == 2) {
        this.context.commit("SET_REMAINING_TIME", remainingTime);
        this.context.commit(
          "SET_GAME_COMPONENT",
          this.context.getters.getGameComponentName
        );
        this.context.commit("START_TIMER");
      }
      // if it's the score announcing phase
      if (roundPhase == 3) {
        this.context.dispatch("setScoresFromPlayersIds", scores);
        this.context.commit("SET_GAME_COMPONENT", "ScoreAnnouncer");
      }
    }
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
  wsPlayerLeftParty(data: { playerId: string; newLeaderId?: string }) {
    this.context.commit("REMOVE_PARTY_MEMBER", data.playerId);
    // if the server sent a new leader id
    if (data.newLeaderId) {
      this.context.commit("SET_NEW_LEADER", data.newLeaderId);
    }
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

  // recevied when the game begins
  @Action
  wsStartGame() {
    // load the Game.vue component by setting isLobby to false
    this.context.commit("SET_IS_LOBBY", false);
    console.log("[Room.wsStartGame]GAME IS STARTING NOW!");
  }

  @Action
  wsNewRound({ word }: { word: string }) {
    // prepare for a new round by resetting all the state modified in the previous round
    this.context.commit("RESET_ROUND_STATE");
    // reset the state of the player and the whole party as having found the correct answer
    this.context.commit("RESET_PARTY_FOUND_ANSWER");
    this.context.commit("RESET_PLAYER_FOUND_ANSWER");

    const gameComponent = this.context.getters.getRoomComponent;
    // increment the round
    this.context.commit("NEXT_ROUND");
    // at the beginning of the round, set the room component to RoundAnnouncer if it is not already
    if (gameComponent != "RoundAnnouncer") {
      this.context.commit("SET_GAME_COMPONENT", "RoundAnnouncer");
    }

    // set the hint word
    this.context.commit("SET_WORD", word);
    // reset the round score after displaying them in the previous round
    this.context.commit("RESET_ROUND_SCORE");
  }

  @Action
  wsTimerStarted() {
    // load the game component at the starting of the timer
    this.context.commit(
      "SET_GAME_COMPONENT",
      this.context.getters.getGameComponentName
    );
    // start counting down
    this.context.commit("START_TIMER");
  }

  /** returns a sorted array of the player scores, replacing the ids with the players username */
  @Action
  setScoresFromPlayersIds(rawScores: RoundScore) {
    const party = this.context.rootGetters.getParty;
    const scores: PlayerScore[] = [];

    for (const [playerId, score] of Object.entries(rawScores)) {
      const playerName: string = party[playerId].username;
      scores.push({
        id: playerId,
        username: playerName,
        score,
      });
    }
    // sort the scores based on the score points from highest to lowest
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    this.context.commit("SET_ROUND_SCORE", sortedScores);
  }

  @Action
  wsDisplayScores({ scores }: { scores: RoundScore }) {
    this.context.commit("STOP_TIMER");

    this.context.dispatch("setScoresFromPlayersIds", scores);
    // increment the round score for each player according to the player id
    this.context.commit("INCREMENT_PLAYERS_SCORE", scores);

    this.context.commit("SET_GAME_COMPONENT", "ScoreAnnouncer");
  }

  @Action
  wsGameEnded() {
    // display the final scores
    this.context.commit("SET_GAME_ENDED");
    this.context.commit("SET_GAME_COMPONENT", "ScoreAnnouncer");
    console.warn("GAME ENDED!");
  }
}
