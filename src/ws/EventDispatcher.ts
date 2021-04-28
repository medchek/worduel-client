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

  /**
   * send the current player selected word to the server
   * @param index the index of the selected word
   */
  public wordSelected(index: number): void {
    this.ws.send(JSON.stringify({ event: "wordSelected", idx: index }));
  }

  /**
   * send the hint to the other players in the room
   * @param hint the hint contents
   */
  public sendHint(hint: string): void {
    this.ws.send(JSON.stringify({ event: "hint", hint }));
  }
}
