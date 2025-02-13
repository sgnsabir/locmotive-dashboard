// src/pages/user/index.tsx
import React, { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchUsers, deleteUser } from "@/store/actions/userActions";
import Link from "next/link";
import type { User } from "@/types/user";

const UserManagement: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">User Management & Reports</h1>
      <Link
        href="/user/create"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create New User
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: User) => (
              <tr key={u.user_id}>
                <td className="px-4 py-2 border">{u.user_id}</td>
                <td className="px-4 py-2 border">{u.username}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.role}</td>
                <td className="px-4 py-2 border space-x-2">
                  <Link
                    href={`/user/${u.user_id}`}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(u.user_id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
