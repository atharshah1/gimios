import { emit } from "../events";
import { delay, store } from "./store";

export const billingService = {
  async getPlans() {
    await delay();
    return store.plans;
  },
  async getPayments() {
    await delay();
    return store.payments;
  },
  async addPayment(amount: number, status: "paid" | "pending" | "failed") {
    await delay();
    store.payments.push({ id: `pay${store.payments.length + 1}`, amount, status, date: new Date().toISOString().slice(0, 10) });
    emit("billing:changed");
  },
};
