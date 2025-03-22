// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

// AuthWrapper checks if the user is logged in and conditionally wraps children with Layout.
import Layout from "@/components/layout/Layout";

const publicRoutes = ["/login", "/_error", "/403"];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // If the current route is not public and no user is logged in, redirect to /login
    if (!publicRoutes.includes(router.pathname) && !user) {
      router.push("/login");
    }
  }, [user, router.pathname, router]);

  // While waiting for the user state (i.e. not logged in on a protected route) show a loader
  if (!user && !publicRoutes.includes(router.pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // For public routes (like /login) we render the page without the Layout wrapper.
  if (publicRoutes.includes(router.pathname)) {
    return <>{children}</>;
  }

  // Otherwise, wrap protected pages with the Layout
  return <Layout>{children}</Layout>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </Provider>
  );
}

export default MyApp;
