// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, RootState, AppDispatch } from "@/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { getCurrentUser } from "@/api/auth";
import { loginThunk } from "@/store/authSlice";

const publicRoutes = ["/login", "/_error", "/403"];

/**
 * AuthWrapper rehydrates the auth state using the JWT token stored in localStorage.
 * If a token exists but no user is in the Redux state, it fetches the current user
 * from the backend and dispatches a fulfilled action from loginThunk to update the store.
 * If the token is invalid, it clears it and redirects to the login page.
 */
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    async function rehydrateUser() {
      const token = localStorage.getItem("authToken");
      if (token && !user) {
        try {
          const currentUser = await getCurrentUser();
          // Dispatch the fulfilled action of loginThunk manually to update the Redux state.
          dispatch({
            type: loginThunk.fulfilled.type,
            payload: { user: currentUser, token, expiresIn: 3600 },
          });
        } catch {
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
      }
      setRehydrated(true);
    }
    rehydrateUser();
  }, [user, dispatch, router]);

  if (!rehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user && !publicRoutes.includes(router.pathname)) {
    router.push("/login");
    return null;
  }

  return publicRoutes.includes(router.pathname) ? (
    <>{children}</>
  ) : (
    <Layout>{children}</Layout>
  );
};

/**
 * MyApp is the custom App component.
 * We add a client‑only check so that rendering that depends on browser APIs (e.g. localStorage)
 * only occurs after hydration to avoid SSR issues.
 */
function MyApp({ Component, pageProps }: AppProps) {
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
