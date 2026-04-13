import { emit } from "../events";
import { delay, store } from "./store";

export const authService = {
  async getSession() {
    await delay();
    return store.auth.user;
  },
  async signOut() {
    await delay(120);
    store.auth.user = { ...store.auth.user, name: "Signed out" };
    emit("auth:changed");
  },
};
