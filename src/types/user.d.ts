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
