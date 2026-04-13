import { useEffect } from "react";
import { subscribe } from "../events";
import { billingService } from "../services/billing.service";
import { useDomainData } from "./useDomainData";

export function useBilling() {
  const plans = useDomainData(() => billingService.getPlans(), []);
  const payments = useDomainData(() => billingService.getPayments(), []);
  useEffect(
    () => subscribe("billing:changed", () => {
      void plans.refresh();
      void payments.refresh();
    }),
    [plans, payments],
  );
  return { plans, payments };
}
