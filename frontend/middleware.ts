import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

type ConnectionGeo = {
  country?: string;
  region?: string;
  city?: string;
  timeZone?: string;
};

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
}

function readLocationHeader(value: string | null) {
  if (!value) return undefined;

  try {
    return decodeURIComponent(value).slice(0, 100);
  } catch {
    return value.slice(0, 100);
  }
}

function getGeo(request: NextRequest): ConnectionGeo | undefined {
  const geo = {
    country: readLocationHeader(
      request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry"),
    ),
    region: readLocationHeader(request.headers.get("x-vercel-ip-country-region")),
    city: readLocationHeader(request.headers.get("x-vercel-ip-city")),
    timeZone: readLocationHeader(request.headers.get("x-vercel-ip-timezone")),
  };

  return Object.values(geo).some(Boolean) ? geo : undefined;
}

function logConnection(request: NextRequest, apiUrl: string) {
  const ip = getClientIp(request);
  if (!ip) return Promise.resolve();

  return fetch(`${apiUrl}/api/v1/connection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ip,
      path: request.nextUrl.pathname,
      geo: getGeo(request),
      userAgent: request.headers.get("user-agent")?.slice(0, 512),
      language: request.headers.get("accept-language")?.slice(0, 100),
    }),
  }).catch(() => undefined);
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const path = request.nextUrl.pathname;
  const apiUrl = process.env.CONNECTION_LOG_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (apiUrl && request.method === "GET" && !isPrefetch) {
    event.waitUntil(logConnection(request, apiUrl));
  }

  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  //const isRootPage = request.nextUrl.pathname === "/";

  // Si no hay token y está intentando acceder al dashboard
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay token y está en páginas de auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si está en la página raíz, redirigir según autenticación
  /*if (isRootPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }*/

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/register",
    //'/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
