// lib/withRoleGuard.tsx
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/router";

interface WithRoleGuardOptions {
  requiredRole?: string; // e.g. "admin" or "operator"
  allowedRoles?: string[]; // alternative if you want to allow multiple roles
}

function withRoleGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithRoleGuardOptions
): FC<P> {
  const { requiredRole, allowedRoles } = options;

  const ComponentWithRoleGuard: FC<P> = (props) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
      // If user not logged in or role not matched, redirect or show error
      if (!user) {
        router.push("/login");
        return;
      }
      const roleMatch = allowedRoles
        ? allowedRoles.includes(user.role)
        : requiredRole
        ? user.role === requiredRole
        : true; // if no roles specified, allow all

      if (!roleMatch) {
        router.push("/403");
      }
    }, [router, user]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithRoleGuard;
}

export default withRoleGuard;
