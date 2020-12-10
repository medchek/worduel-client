import { WsClient } from "@/ws/WsClient";
import { Module, VuexModule } from "vuex-module-decorators";

@Module
export default class WsModule extends VuexModule {
  _ws: WsClient = new WsClient();

  get ws() {
    return this._ws;
  }
}
