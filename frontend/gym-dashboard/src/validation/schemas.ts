export type ValidationResult = { ok: true } | { ok: false; message: string };

export const trainerSchema = {
  parse(input: { name: string }): ValidationResult {
    if (!input.name.trim()) return { ok: false, message: "Trainer name is required" };
    if (input.name.trim().length < 2) return { ok: false, message: "Trainer name must be at least 2 characters" };
    return { ok: true };
  },
};
