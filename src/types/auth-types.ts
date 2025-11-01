

export type UserDataType = {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  avatarId: string | null;
  newsBalance: number;
  audioBalance: number;
  isPremium: boolean;
  planExpiryDate: Date | null;
  defaultCountry: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export type OtpType = "register" | "login" | "forget-password" | "delete-account";