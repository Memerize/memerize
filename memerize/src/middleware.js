import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CustomError, handleError } from "./helpers/handleError";

async function auth(request) {
  const authCookie = cookies().get("Authorization");

  if (!authCookie) throw new CustomError("Invalid token", 401);

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

export async function middleware(request) {
  try {
    const requestHeaders = await auth(request);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export const config = {
  matcher: ["/api/saves/:path*"],
};
