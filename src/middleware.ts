import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const authRoutes: string[] = ["/sign-in", "/sign-up"] as const;

export const middleware = async (request: NextRequest) => {
  // const sessionCookie = getSessionCookie(request);
  // const {
  //   url,
  //   nextUrl: { pathname },
  // } = request;

  // if (!sessionCookie && !authRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/sign-in", url));
  // }

  // if (sessionCookie && authRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/", url));
  // }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico).*)"],
};
