// types/user.d.ts
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  avatar: string;
  twoFactorEnabled: boolean;
  phone: string;
}
// Extended type for the backend user response
interface UserResponse {
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  avatar?: string;
  twoFactorEnabled?: boolean;
  phone?: string;
}

// Define a type for the local profile form state with all fields required.
interface ProfileData {
  username: string;
  email: string;
  avatar: string;
  twoFactorEnabled: boolean;
  phone: string;
}

// Define types for creating/updating a user
export interface UserData {
  username: string;
  email: string;
  role: string;
}
