import { z } from "zod";

export const createSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
  imageKey: z
    .string()
    .transform((val) => val || null)
    .nullish(),
});
export const updateSchema = createSchema.extend({
  reviewed: z.boolean(),
  published: z.boolean(),
});
