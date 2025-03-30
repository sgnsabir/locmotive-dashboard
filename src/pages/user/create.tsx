// src/pages/user/create.tsx
import React from "react";
import CreateUserPage from "@/components/user/CreateUserPage";
import withRoleGuard from "@/lib/withRoleGuard";

function CreateUser() {
  return <CreateUserPage />;
}

export default withRoleGuard(CreateUser, { requiredRole: "admin" });
