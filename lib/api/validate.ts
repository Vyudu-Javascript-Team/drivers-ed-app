import { z } from "zod";

export function validateRequest(data: any, schema: z.ZodSchema) {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      };
    }
    return { success: false, error: "Validation failed" };
  }
}