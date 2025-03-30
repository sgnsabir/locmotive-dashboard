// src/pages/user/[id].tsx
import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getUserById } from "@/api/userManagement";
import { UserResponse } from "@/types/user";

const UserDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: user, error } = useSWR<UserResponse>(
    id ? `/api/users/${id}` : null,
    () => getUserById(Number(id))
  );

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">
          Error loading user details:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">User: {user.username}</h1>
      <div className="bg-white p-4 rounded-md shadow">
        <p>
          <strong>Role:</strong> {user.roles ? user.roles.join(", ") : "N/A"}
        </p>
        {user.email && (
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        )}
        {user.createdAt && (
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
