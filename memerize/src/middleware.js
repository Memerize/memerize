import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CustomError, handleError } from "./helpers/handleError";
import { getSession } from "next-auth/react";

async function auth(request) {
  const authCookie = cookies().get("Authorization");
  const googleSessionToken = cookies().get("next-auth.session-token");

  if (!authCookie && !googleSessionToken) {
    throw new CustomError("Invalid token", 401);
  }

  // Manual login using Authorization token
  if (authCookie) {
    const [type, token] = authCookie.value.split(" ");
    if (type !== "Bearer") throw new CustomError("Invalid token", 401);

    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, jwtSecret);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload._id.toString());
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-username", payload.username);
    requestHeaders.set("x-user-image", payload.image);
    
    return requestHeaders;
  }

  // Google session login via next-auth
  else if (googleSessionToken) {
    try {
      const session = await getSession({
        req: {
          headers: {
            cookie: `next-auth.session-token=${googleSessionToken.value}`,
          },
        },
      });

      if (!session) {
        throw new CustomError("Invalid Google session", 401);
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-email", session.user.email);
      requestHeaders.set("x-user-username", session.user.username);
      requestHeaders.set("x-user-image", session.user.image);

      // console.log(requestHeaders, "Google User Session Headers");
      return requestHeaders;
    } catch (error) {
      console.error("Failed to get session from next-auth", error);
      throw new CustomError("Invalid Google session", 401);
    }
  }
}

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  try {
    if (pathname.startsWith("/api/posts") && request.method === "POST") {
      const requestHeaders = await auth(request);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (
      pathname.startsWith("/api/saves") &&
      ["GET", "POST"].includes(request.method)
    ) {
      const requestHeaders = await auth(request);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (pathname.startsWith("/api/comments") && request.method === "POST") {
      const requestHeaders = await auth(request);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (
      pathname.startsWith("/api/users") &&
      ["POST", "PUT", "PATCH"].includes(request.method)
    ) {
      const requestHeaders = await auth(request);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (
      pathname.startsWith("/api/notifications") &&
      ["GET", "POST", "PATCH"].includes(request.method)
    ) {
      const requestHeaders = await auth(request);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (pathname.startsWith("/api/likes") && request.method === "POST") {
      const requestHeaders = await auth(request);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    return handleError(error);
  }
}

export const config = {
  matcher: [
    "/api/posts",
    "/api/saves/:path*",
    "/api/comments/:path*",
    "/api/users/:path*",
    "/api/notifications/:path*",
    "/api/likes/:path*",
  ],
};
