export type RouteType = "PUBLIC" | "PROTECTED" | "UNKNOWN";

export const RouteConfig = {
  PUBLIC_ROUTES: ["/login", "register"],
  PROTECTED_ROUTES: ["/user", "/dashboard", "/payments"],
};

export function getRouteType(pathname: string): RouteType {
  if (matchRoute(pathname, RouteConfig.PUBLIC_ROUTES)) {
    return "PUBLIC";
  }

  if (matchRoute(pathname, RouteConfig.PROTECTED_ROUTES)) {
    return "PROTECTED";
  }

  return "UNKNOWN";
}

export function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    let pattern = route;

    if (pattern.endsWith("/**")) {
      pattern = pattern.replace("/**", "(?:/.*)?");
    } else {
      pattern = pattern.replace(/\*/g, "[^/]+");
    }

    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });
}

export function isPublicRoute(pathname: string): boolean {
  return matchRoute(pathname, RouteConfig.PUBLIC_ROUTES);
}

export function isProtectedRoute(pathname: string): boolean {
  return matchRoute(pathname, RouteConfig.PROTECTED_ROUTES);
}

export const CLIENT_ROUTES = {
  AUTH_ROUTE: "/login",
  DEFAULT_AUTHENTICATED_ROUTE: "/dashboard",
  ROOT_REDIRECT_ROUTES: ["/"],
  PUBLIC_ROUTES: ["/auth"],
  PROTECTED_ROUTES: ["/user", "/dashboard", "/payments"],
} as const;

export function isClientRootRedirectRoute(pathname: string): boolean {
  return matchRoute(pathname, [...CLIENT_ROUTES.ROOT_REDIRECT_ROUTES]);
}

export function isClientPublicRoute(pathname: string): boolean {
  return matchRoute(pathname, [...CLIENT_ROUTES.PUBLIC_ROUTES]);
}

export function isClientProtectedRoute(pathname: string): boolean {
  return matchRoute(pathname, [...CLIENT_ROUTES.PROTECTED_ROUTES]);
}
