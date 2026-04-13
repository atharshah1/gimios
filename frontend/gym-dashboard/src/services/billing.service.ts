import { emit } from "../events";
import { withApiFallback } from "./http.service";
import { delay, persistStore, store } from "./store";

export const billingService = {
  async getPlans() {
    return withApiFallback(
      () => Promise.reject(new Error("billing plans endpoint not wired")),
      async () => {
        await delay();
        return store.plans;
      },
    );
  },
  async getPayments() {
    return withApiFallback(
      () => Promise.reject(new Error("billing payments endpoint not wired")),
      async () => {
        await delay();
        return store.payments;
      },
    );
  },
  async addPayment(amount: number, status: "paid" | "pending" | "failed") {
    store.payments.push({ id: `pay${store.payments.length + 1}`, amount, status, date: new Date().toISOString().slice(0, 10) });
    persistStore();
    emit("billing:changed");
    await delay();
  },
};
