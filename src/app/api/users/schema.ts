import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().nonempty().toUpperCase(),
  email: z.string().nonempty().email().toLowerCase(),
  password: z.string().nonempty(),
});

export const updateUpdateSchema = createUserSchema.extend({
  active: z.boolean(),
});
