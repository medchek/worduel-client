/* READYSTATE REFERENCE
  0	CONNECTING	Socket has been created. The connection is not yet open.
  1	OPEN	The connection is open and ready to communicate.
  2	CLOSING	The connection is in the process of closing.
  3	CLOSED	The connection is closed or couldn't be opened.
*/
import { Store } from "vuex";

interface InitConnectionOptions {
  host: string;
  port: number;
  store?: Store<any>;
  path: "create" | "join";
  params: {
    username: string;
    id: string;
  };
}

interface SnackOptions {
  type?: string;
  message: string;
}

export class WsClient {
  private _ws: WebSocket | null = null;
  private store: Store<any> | null = null;
  private url = "";

  get ws(): WebSocket {
    if (!this._ws) throw new Error("Websocket not initialized");
    return this._ws;
  }

  /**
   * initialize the connection to the websocket server.
   * It Will throw an error if the the server is impossible to reach or any error is encountred while the connection is open.
   * Additionally, the vuex store can be passed to trigger different mutations/actions in reaction to server events and messages
   * @param store optional vuex store
   */
  public initConnection(options: InitConnectionOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const { store, host, port, path, params } = options;

      this.url = `ws://${host}:${port}/${path}?username=${params.username}&id=${params.id}`;
      // this will serve to trigger mutations directly from here
      if (store) this.store = store;
      // exception handler
      try {
        console.log(`Attempting to connect to ${this.url}`);
        this._ws = new WebSocket(encodeURI(this.url));

        this._ws.onopen = () => {
          resolve();
        };
        // this.onOpen();

        this._ws.onerror = () => {
          reject("Could not connect to the server");
        };
        // this.onError();
        this.onClose();
        this.onMessage();
      } catch (err) {
        console.error(err);
        // reject("Could not connect to the server");
        throw new Error("Error while connection to the server.");
      }
    });
  }

  onMessage(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onmessage = messageEvent => {
      const data = JSON.parse(messageEvent.data);
      console.log(data);
      console.log(messageEvent);
    };
  }

  private onOpen(): void {
    if (!this._ws) throw new Error("Websocket not initialized");
    this._ws.onopen = ev => {
      console.log("CONNECTION ESTABLISHED!", ev);
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
      console.error("[WsClient] onClose() =>", err);
    };
  }

  /**
   * Triggers the snackbar of the app, when the store has been passed to the class
   * @param message
   * @param type
   */
  private triggerSnack(options: SnackOptions): void {
    if (this.store == null) {
      console.error(
        "Store not available. In order to use the store, it must be passed to the initConnection method"
      );
      return;
    }
    const { message, type } = options;
    // properties : show, message, type
    this.store.commit("SET_SNACK", {
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

/**
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
