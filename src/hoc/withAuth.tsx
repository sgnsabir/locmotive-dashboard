//src/hoc/withAuth.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Higher-Order Component to protect routes that require authentication.
const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
      // If no token is found, redirect the user to /login.
      if (!token) {
        router.push("/login");
      }
    }, [token, router]);

    // Optionally, display a loading indicator while checking authentication.
    if (!token) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
