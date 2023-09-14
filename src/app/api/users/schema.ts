import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().nonempty().toUpperCase(),
  lastName: z.string().nonempty().toUpperCase(),
  username: z.string().nonempty().toUpperCase(),
  email: z.string().nonempty().email().toLowerCase(),
  password: z.string().nonempty(),
});

export const updateUpdateSchema = createUserSchema.extend({
  active: z.boolean(),
});
