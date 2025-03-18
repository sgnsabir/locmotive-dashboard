// src/pages/login.tsx

import React, { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { loginSuccess } from "@/store/authSlice"; // Use named import for the action creator
import { login as loginApi } from "@/api";
import type { AppDispatch } from "@/store";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginApi(username, password);
      // For simplicity, storing token in localStorage (consider using HTTP-only cookies in production)
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("username", response.username);
      // Dispatch loginSuccess with the correct payload shape
      dispatch(
        loginSuccess({
          user: {
            username: response.username,
            role: "operator", // Adjust based on backend response if available
            email: "", // Optionally set if provided
            avatar: "", // Optionally set if provided
            twoFactorEnabled: false,
          },
          token: response.token,
          expiresIn: response.expiresIn,
        })
      );
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
