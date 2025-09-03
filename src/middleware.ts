import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const authRoutes: string[] = ["/sign-in", "/sign-up"] as const;

export const middleware = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request);
  const {
    url,
    nextUrl: { pathname },
  } = request;

  console.log(sessionCookie);
  if (
    !sessionCookie &&
    !authRoutes.includes(pathname) &&
    !pathname.startsWith("/api/auth")
  ) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  if (authRoutes.includes(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL("/", url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
