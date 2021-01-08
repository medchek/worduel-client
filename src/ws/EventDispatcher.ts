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
}
