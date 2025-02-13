// pages/profile.tsx

import React, { FC, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { updateProfile } from "@/store/actions/profileActions";
import TwoFactorAuth from "@/components/TwoFactorAuth";

const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setAvatar(currentUser.avatar || "");
      setTwoFactorEnabled(currentUser.twoFactorEnabled || false);
      setPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  const handleSave = () => {
    dispatch(
      updateProfile({
        username,
        email,
        avatar,
        twoFactorEnabled,
        phone,
      })
    );
    alert("Profile updated!");
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">No user is currently logged in.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="mt-1 block border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block border rounded p-2 w-full"
          />
        </div>
        <TwoFactorAuth
          enabled={twoFactorEnabled}
          onToggle={(enabled: boolean) => setTwoFactorEnabled(enabled)}
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </section>
    </div>
  );
};

export default Profile;
