export class EventDispatcher {
  constructor(private ws: WebSocket) {}

  /**
   * Send the updated value of the room settings
   * @param sid setting id
   * @param value the updated value of the setting
   */
  public updateSettings(sid: number, value: number): void {
    const data = JSON.stringify({ event: "setSettings", sid, id: value });
    this.ws.send(data);
  }
  /**
   * Request the server the start the game
   */
  public startGame(): void {
    this.ws.send(JSON.stringify({ event: "start" }));
  }
  /**
   * send the client answer to the server
   * @param answer the answer
   */
  public answer(answer: string): void {
    this.ws.send(JSON.stringify({ event: "answer", answer }));
  }
}
