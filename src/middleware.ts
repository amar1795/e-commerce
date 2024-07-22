import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextApiRequest, NextApiResponse } from "next";

export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/about-us",
  "/password-reset",
  "/contact-us",
  "/categories",
 
  
];

// "/cart",
//   "/checkout",
//   "/order-success",
//   "/orders",
//   "/wishlist",
//   "/password-reset",
//   "/account-settings",

// these routes needs authentication to access
export const authRoutes = [
  "/password-reset",
  "/login",
  "/signup",
  "/password-reset",

  
];

const restrictedRoutes = [
  "/checkout",
  "/account-settings"
]

// these are api routes that anyone with access can't hit without authentication
export const apiAuthPrefix = "/api/auth";

// these are the routes that user after login will be redirected to or if the user has already logged in then going back to these routes will make the user go back to these routes 
export const DEFAULT_LOGIN_REDIRECT_PATH = "/";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const userLoggedIn = req.auth ? true : false;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

 const restricted = restrictedRoutes.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route)
  );
  
  if (isApiAuthRoute) {
    return null;
  }

  
  if (isAuthRoute) {
    if (userLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_PATH, nextUrl));
    }
    return null;
  }

  if (restricted) {
    if (!userLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }

   // this is to make sure that the user is redirected back to the page he was on after loggin in
  if (!userLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
}
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
