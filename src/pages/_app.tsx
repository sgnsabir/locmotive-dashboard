// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "@/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

const publicRoutes = ["/login", "/_error", "/403"];

/**
 * AuthWrapper ensures that for protected routes the user is already authenticated.
 * If not, it redirects to /login.
 */
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // If on a protected route and no user is in state, redirect to login.
    if (!publicRoutes.includes(router.pathname) && !user) {
      router.push("/login");
    }
  }, [user, router.pathname, router]);

  // While waiting for the user state on a protected route, show a loader.
  if (!user && !publicRoutes.includes(router.pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Public routes render directly; protected routes are wrapped with Layout.
  return publicRoutes.includes(router.pathname) ? (
    <>{children}</>
  ) : (
    <Layout>{children}</Layout>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  // IMPORTANT: We add a client-only check so that protected pages are rendered only after mount.
  // This prevents SSR from calling getToken (which depends on localStorage) and avoids the 401 errors.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Provider store={store}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </Provider>
  );
}

export default MyApp;
