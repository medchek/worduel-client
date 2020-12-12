import { Module, Mutation, VuexModule } from "vuex-module-decorators";

interface SnackBar {
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
    show: false,
    type: "error",
    message: "",
  };

  get selectedGame(): number | null {
    return this.selectedGame;
  }

  get getSnack(): SnackBar {
    return this.snack;
  }

  get getIsBeginLoading(): boolean {
    return this.isBeginLoading;
  }

  @Mutation
  SET_IS_BEGIN_LOADING(isLoading: boolean) {
    this.isBeginLoading = isLoading;
  }

  @Mutation
  SET_SELECTED_GAME(selectedGameId: number) {
    this.selectedGameId = selectedGameId;
  }

  @Mutation
  SET_SNACK(snack: SnackBar) {
    const { type, message, show } = snack;

    this.snack.type = type || "error";
    this.snack.message = message;
    this.snack.show = show;

    // auto hide snackbar
    setTimeout(() => {
      if (this.snack.show) {
        // hide and reset the message after the timeout
        this.snack.show = false;
        this.snack.message = "";
      }
    }, 4000);
  }

  @Mutation
  CLOSE_SNACK() {
    this.snack.show = false;
    this.snack.message = "";
  }
}
