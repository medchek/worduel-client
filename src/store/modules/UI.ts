import { Module, Mutation, VuexModule } from "vuex-module-decorators";

interface SnackBar {
  timeout: number | null;
  show: boolean;
  type?: string;
  message: string;
}

@Module
export default class UserInterface extends VuexModule {
  // Home.uve
  isBeginLoading = false;
  // GameSelector.vue
  selectedGameId: number | null = null;
  // AppSnack.vue
  snack: SnackBar = {
    timeout: null,
    show: false,
    type: "error",
    message: "",
  };

  // TheHeader.vue sm && less
  showChat = true;
  showParty = true;

  get selectedGame(): number | null {
    return this.selectedGame;
  }

  get getSnack(): SnackBar {
    return this.snack;
  }

  get getIsBeginLoading(): boolean {
    return this.isBeginLoading;
  }

  get getShowParty(): boolean {
    return this.showParty;
  }

  get getShowChat(): boolean {
    return this.showChat;
  }

  @Mutation
  TOGGLE_PARTY() {
    this.showParty = !this.showParty;
  }

  @Mutation
  TOGGLE_CHAT() {
    this.showChat = !this.showChat;
    console.log(`[TOGGLE_CHAT] => current value = ${this.showChat}`);
  }

  @Mutation
  SET_IS_BEGIN_LOADING(isLoading: boolean) {
    this.isBeginLoading = isLoading;
  }

  @Mutation
  SET_SELECTED_GAME(selectedGameId: number) {
    this.selectedGameId = selectedGameId;
  }

  /** RESET THE UI MODULE BACK TO ITS DEFAULT STATE */
  @Mutation
  RESET_ALL_UI(): void {
    this.isBeginLoading = false;
    this.selectedGameId = null;
  }

  @Mutation
  SET_SNACK(snack: SnackBar) {
    if (this.snack.timeout) clearTimeout(this.snack.timeout);
    const { type, message } = snack;

    this.snack.type = type || "error";
    this.snack.message = message;
    this.snack.show = true;

    // auto hide snackbar
    this.snack.timeout = setTimeout(() => {
      if (this.snack.show) {
        // hide and reset the message after the timeout
        this.snack.show = false;
        this.snack.message = "";
      }
    }, 3000);
  }
  @Mutation
  CLOSE_SNACK() {
    this.snack.show = false;
    this.snack.message = "";
  }
}
