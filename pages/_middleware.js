import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token will exist if user is logged in...
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the requests if the following is true...
  // If its a request for next-auth session or the token exists, go through...
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect them to login if they dont have token AND are requesting a protected route...
  if (!token && pathname !== "/login") {
    return NextResponse.rewrite(new URL("/login", req.url));
  }
}
