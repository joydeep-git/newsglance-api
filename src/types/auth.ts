import { ImageFileType } from "./index.js";


export type UserDataType = {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  password?: string;
  avatarId: string;
  avatar: ImageFileType;
  newsBalance: number;
  audioBalance: number;
  isPremium: boolean;
  planExpiryDate: Date | null;
  defaultCountry: string;
  createdAt: Date;
  updatedAt: Date;
  isNumVerified: boolean;
  isGoogle: boolean;
}



export type OtpType = "register" | "login" | "forget-password" | "delete-account";