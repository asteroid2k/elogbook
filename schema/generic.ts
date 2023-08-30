import { ZodError, ZodIssue, ZodSchema } from "zod";

export function formatZodErrors(errors: ZodIssue[]) {
  let parsedIssues: { field: string; message: string }[] = [];
  for (let i = 0; i < errors.length; i++) {
    const { message, path } = errors[i];
    parsedIssues.push({ field: path.join("."), message });
  }
  return parsedIssues;
}
