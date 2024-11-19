import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "./rate-limit";
import { validateRequest } from "./validate";
import { logger } from "@/lib/logger";

export async function withApiHandler(
  req: Request,
  handler: (req: Request) => Promise<Response>,
  options: {
    requireAuth?: boolean;
    rateLimit?: boolean;
    validate?: any;
  } = {}
) {
  try {
    // Rate limiting
    if (options.rateLimit) {
      const limiter = await rateLimit.check(req);
      if (!limiter.success) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    }

    // Authentication
    if (options.requireAuth) {
      const token = await getToken({ req });
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Request validation
    if (options.validate) {
      const body = await req.json();
      const validationResult = validateRequest(body, options.validate);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error },
          { status: 400 }
        );
      }
    }

    // Handle request
    const response = await handler(req);
    return response;

  } catch (error) {
    logger.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}