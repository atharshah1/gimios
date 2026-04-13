export type ValidationResult = { ok: true } | { ok: false; message: string };

export const trainerSchema = {
  parse(input: { name: string }): ValidationResult {
    if (!input.name.trim()) return { ok: false, message: "Trainer name is required" };
    if (input.name.trim().length < 2) return { ok: false, message: "Trainer name must be at least 2 characters" };
    return { ok: true };
  },
};

export const memberSchema = {
  parse(input: { name: string }): ValidationResult {
    if (!input.name.trim()) return { ok: false, message: "Member name is required" };
    if (input.name.trim().length < 2) return { ok: false, message: "Member name must be at least 2 characters" };
    return { ok: true };
  },
};

export const slotSchema = {
  parse(input: { title: string; startHour: number }): ValidationResult {
    if (!input.title.trim()) return { ok: false, message: "Slot title is required" };
    if (input.startHour < 0 || input.startHour > 23) return { ok: false, message: "Start hour must be between 0 and 23" };
    return { ok: true };
  },
};

export const paymentSchema = {
  parse(input: { amount: number }): ValidationResult {
    if (!Number.isFinite(input.amount) || input.amount <= 0) return { ok: false, message: "Payment amount must be greater than 0" };
    return { ok: true };
  },
};
