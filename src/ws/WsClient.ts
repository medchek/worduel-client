import { EventDispatcher } from "./EventDispatcher";
import { Store } from "vuex";
import router from "@/router";

import { server as serverConfig } from "@/config/settings";

// removed from below interface
// host: string;
// port: number | undefined;
interface InitConnectionOptions {
  path: "create" | "join";
  params: {
    username: string;
    id: string;
  };
}

interface MessageFormat {
  event: string;
  message?: string;
  playerId?: string;
  type?: string;
  scores?: { [playerName: string]: number };
  word?: string;
  phase?: number;
  remainingTime?: number;
  round?: number;
  wordList?: string[];
  wordLen?: number;
  riddle?: string;
}

interface SnackOptions {
  type?: string;
  message: string;
}

export class WsClient {
  private _ws: WebSocket | null = null;
  private url = "";
  private _eventDispatch!: EventDispatcher;
  // whether the client successfully established a ws connection
  private _connectSuccess = false;

  /** eslint-disable-line @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line
  constructor(private _store: Store<any>) {}
  get ws(): WebSocket {
    if (!this._ws) throw new Error("Websocket not initialized");
    return this._ws;
  }

  get dispatch(): EventDispatcher {
    return this._eventDispatch;
  }

  /**
   * initialize the connection to the websocket server.
   */
  public initConnection(options: InitConnectionOptions): void {
    const { path, params } = options;
    // if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    //   this.url = `wss://${host}/${path}?username=${params.username}&id=${params.id}`;
    // } else {
    //   this.url = `ws://localhost:9001/${path}?username=${params.username}&id=${params.id}`;
    // }
    this.url = `${serverConfig.wsProtocol}://${serverConfig.host}/${path}?username=${params.username}&id=${params.id}`;

    // exception handler
    try {
      console.log(`Attempting to connect to ${this.url}`);
      this._ws = new WebSocket(encodeURI(this.url));
      this._eventDispatch = new EventDispatcher(this._ws);
      this.onOpen();
      this.onError();
      this.onClose();
      this.onMessage();
    } catch (err) {
      console.error(err);
      this._connectSuccess = false;
      throw new Error("Error while establishing connection to the server.");
    }
  }
  /**============================================================================
   * APP COMMUNICATION CORE
   *==========================================================================*/
  onMessage(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onmessage = messageEvent => {
      const message: MessageFormat = JSON.parse(messageEvent.data);
      const { event, ...data } = message;
      switch (event) {
        // * roomCreated EVENT
        case "roomCreated":
          this._store.dispatch("wsRoomCreated", data);
          break;
        // * roomJoin EVENT
        case "roomJoined":
          this._store.dispatch("wsRoomJoined", data);
          break;
        // * player join party EVENT
        case "playerJoinedParty":
          this._store.dispatch("wsPlayerJoined", data);
          break;
        // * player left party EVENT
        case "playerLeftParty":
          this._store.dispatch("wsPlayerLeftParty", data);
          break;
        // * settings updated EVENT
        case "settingsUpdated":
          this._store.dispatch("wsSettingsUpdated", data);
          break;
        // * start game EVENT
        case "start":
          this._store.dispatch("wsStartGame", data);
          break;
        // * new round event
        case "newRound":
          this._store.dispatch("wsNewRound", data);
          break;
        // * new turn event
        case "newTurn":
          this._store.dispatch("wsNewTurn", data);
          break;
        case "wordSelect":
          this._store.dispatch("wsWordSelect", data);
          break;
        case "wordLen":
          this._store.dispatch("wsWordToGuessLen", data);
          break;
        case "hint":
          this._store.dispatch("wsHintReceived", data); // hint
          break;
        // * timer started EVENT
        case "timerStarted":
          this._store.dispatch("wsTimerStarted");
          break;
        // * chat message EVENT
        case "message": // recevied when client send messages/answers in the chat
          this._store.dispatch("wsChatMessageReceived", data);
          break;
        // * chat message EVENT
        case "correct": // recevied when client answers correctly
          this._store.dispatch("wsCorrectAnswer", data);
          break;
        // * chat rate limiting EVENT
        case "slowDown": // recieved when client sends too many messages in a short amount of time
          this._store.dispatch("wsChatSlowDown");
          break;
        // * scores EVENT
        case "score": // received when the round ends
          this._store.dispatch("wsDisplayScores", data);
          break;
        // * scores EVENT
        case "gameEnded": // received when the round ends
          this._store.dispatch("wsGameEnded");
          break;
        // * nextEvent
      }
    };
  }

  private onOpen(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onopen = (/* event */) => {
      this._connectSuccess = true;
      console.log("CONNECTION ESTABLISHED!" /*ev*/);
    };
  }

  private onError(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onerror = err => {
      // show snackbar
      this.triggerSnack({
        message: "An unexpected error occurred",
        type: "error",
      });
      console.error("[WsClient] onError() =>", err);
    };
  }

  private onClose(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onclose = err => {
      const message = this._connectSuccess
        ? "Disconnected from the server"
        : "Could not connect to the server";
      // show snackbar
      this.triggerSnack({
        message,
        type: "error",
      });
      this._store.commit("SET_IS_BEGIN_LOADING", false);
      if (router.currentRoute.value.name !== "home") {
        router.replace({
          name: "home",
        });
      }
      this._store.dispatch("resetStore");
      console.error("[WsClient] onClose() =>", err);
    };
  }

  /**
   * Triggers the snackbar of the app, when the store has been passed to the class
   * @param message
   * @param type
   */
  private triggerSnack(options: SnackOptions): void {
    const { message, type } = options;
    // properties : show, message, type
    this._store.commit("SET_SNACK", {
      show: true,
      message,
      type,
    });
  }
}
