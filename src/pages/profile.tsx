// src/pages/profile.tsx
import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/store";
import { getCurrentUser } from "@/api/auth";
import { loginSuccess } from "@/store/authSlice";
import TwoFactorAuth from "@/components/TwoFactorAuth";
import { UserResponse, ProfileData } from "@/types/user";

const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  // Initialize local state with empty string defaults to avoid undefined values.
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    avatar: "",
    twoFactorEnabled: false,
    phone: "",
  });

  // On mount, load current user data from the backend and update Redux state.
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        const extendedUser = currentUser as UserResponse;
        const tokenValue =
          process.env.NODE_ENV === "production"
            ? ""
            : localStorage.getItem("authToken") || "";
        const reduxUser = {
          username: extendedUser.username ?? "",
          email: extendedUser.email ?? "",
          role:
            extendedUser.roles && extendedUser.roles.length > 0
              ? extendedUser.roles[0]
              : "operator",
          avatar: extendedUser.avatar ?? "/images/default-avatar.png",
          twoFactorEnabled: extendedUser.twoFactorEnabled ?? false,
          phone: extendedUser.phone ?? "",
        };
        dispatch(
          loginSuccess({
            user: reduxUser,
            token: tokenValue,
            expiresIn: 3600,
          })
        );
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }
    loadUser();
  }, [dispatch]);

  // Sync Redux user state to local state for form editing
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username ?? "",
        email: user.email ?? "",
        avatar: user.avatar ?? "",
        twoFactorEnabled: user.twoFactorEnabled ?? false,
        phone: user.phone ?? "",
      });
    } else {
      router.push("/login");
    }
  }, [user, router]);

  // Handle profile update (simulate saving by dispatching to Redux; replace with API call if needed)
  const handleSave = async () => {
    if (user) {
      dispatch(
        loginSuccess({
          user: {
            ...user,
            username: profileData.username,
            email: profileData.email,
            avatar: profileData.avatar,
            twoFactorEnabled: profileData.twoFactorEnabled,
            phone: profileData.phone,
          },
          token:
            process.env.NODE_ENV === "production"
              ? ""
              : localStorage.getItem("authToken") || "",
          expiresIn: 3600,
        })
      );
      alert("Profile updated successfully!");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Loading profile...</p>
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
            value={profileData.username}
            onChange={(e) =>
              setProfileData({ ...profileData, username: e.target.value })
            }
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            type="text"
            value={profileData.avatar}
            onChange={(e) =>
              setProfileData({ ...profileData, avatar: e.target.value })
            }
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <TwoFactorAuth
          enabled={profileData.twoFactorEnabled}
          onToggle={(enabled: boolean) =>
            setProfileData({ ...profileData, twoFactorEnabled: enabled })
          }
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
