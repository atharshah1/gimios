import { setAuthToken } from "../api";
import { emit } from "../events";
import { delay, persistStore, store } from "./store";

export const authService = {
  async getSession() {
    await delay();
    return store.auth.user;
  },
  async signIn(role: "gym_owner" | "super_admin") {
    await delay(120);
    store.auth = {
      user: {
        id: role === "super_admin" ? "sa1" : "u1",
        name: role === "super_admin" ? "Platform Admin" : "Neha Owner",
        role,
      },
      token: `demo-${role}-token`,
    };
    setAuthToken(store.auth.token);
    persistStore();
    emit("auth:changed");
  },
  async signOut() {
    await delay(120);
    store.auth = { user: null, token: "" };
    setAuthToken("");
    persistStore();
    emit("auth:changed");
  },
};
