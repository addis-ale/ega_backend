// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Optional: restrict matching paths
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // Protect everything except static assets
};
