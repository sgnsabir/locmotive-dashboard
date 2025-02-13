// pages/login.tsx

import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { login } from "@/store/authSlice";
import { useRouter } from "next/router";

const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
    router.push("/"); // redirect to home or any desired page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow w-80"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <label className="block mb-2">
          <span className="text-sm">Username</span>
          <input
            className="mt-1 block w-full border rounded p-2"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            className="mt-1 block w-full border rounded p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
