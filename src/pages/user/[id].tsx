// pages/user/[id].tsx
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface UserData {
  username: string;
  role: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
}

const UserDetail: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Example mock user data
    const mockUsers: UserData[] = [
      {
        username: "admin",
        role: "admin",
        email: "admin@example.com",
        createdAt: "2024-12-31",
      },
      {
        username: "john",
        role: "operator",
        email: "john@example.com",
        createdAt: "2025-01-15",
      },
    ];
    const found = mockUsers.find((u) => u.username === id) || null;
    setUser(found);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">User not found for: {id}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">User: {user.username}</h1>
      <div className="bg-white p-4 rounded-md shadow">
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        {user.email && (
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        )}
        {user.createdAt && (
          <p>
            <strong>Joined:</strong> {user.createdAt}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
