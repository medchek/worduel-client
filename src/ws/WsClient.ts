import { EventDispatcher } from "./EventDispatcher";
import { Store } from "vuex";
import router from "@/router";

interface InitConnectionOptions {
  host: string;
  port: number;
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
}

interface SnackOptions {
  type?: string;
  message: string;
}

export class WsClient {
  private _ws: WebSocket | null = null;
  private url = "";
  private _eventDispatch!: EventDispatcher;

  /** eslint-disable-line @typescript-eslint/no-explicit-any */
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
    const { host, port, path, params } = options;

    this.url = `ws://${host}:${port}/${path}?username=${params.username}&id=${params.id}`;

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
      // reject("Could not connect to the server");
      throw new Error("Error while connection to the server.");
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
        // * nextEvent
      }
    };
  }

  private onOpen(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onopen = (/* event */) => {
      console.log("CONNECTION ESTABLISHED!" /*ev*/);
    };
  }

  private onError(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onerror = err => {
      // show snackbar
      this.triggerSnack({
        message: "An unexpected error occured",
        type: "error",
      });
      console.error("[WsClient] onError() =>", err);
    };
  }

  private onClose(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onclose = err => {
      // show snackbar
      this.triggerSnack({
        message: "Disconnected from the server",
        type: "error",
      });
      this._store.commit("SET_IS_BEGIN_LOADING", false);
      if (router.currentRoute.value.name !== "home") {
        router.replace({
          name: "home",
        });
      }
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

// decorator test
// function checkWs(target: any, key: string, desc: PropertyDescriptor) {
//   const method = desc.value;

//   desc.value = function() {
//     if (!target["ws"]) throw new Error("nope");
//     method();
//   };
// }

/* READYSTATE REFERENCE

  0	CONNECTING	Socket has been created. The connection is not yet open.
  1	OPEN	The connection is open and ready to communicate.
  2	CLOSING	The connection is in the process of closing.
  3	CLOSED	The connection is closed or couldn't be opened.


 *    onclose
     |Status Code | Meaning         | Contact       | Reference |
    -+------------+-----------------+---------------+-----------|
     | 1000       | Normal Closure  | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1001       | Going Away      | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1002       | Protocol error  | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1003       | Unsupported Data| hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1004       | ---Reserved---- | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1005       | No Status Rcvd  | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1006       | Abnormal Closure| hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1007       | Invalid frame   | hybi@ietf.org | RFC 6455  |
     |            | payload data    |               |           |
    -+------------+-----------------+---------------+-----------|
     | 1008       | Policy Violation| hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1009       | Message Too Big | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1010       | Mandatory Ext.  | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
     | 1011       | Internal Server | hybi@ietf.org | RFC 6455  |
     |            | Error           |               |           |
    -+------------+-----------------+---------------+-----------|
     | 1015       | TLS handshake   | hybi@ietf.org | RFC 6455  |
    -+------------+-----------------+---------------+-----------|
 */
