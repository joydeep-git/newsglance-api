import crypto from "crypto";
import { Request } from "express";


export const shortForm: Record<string, string> = {
  name: "Name",
  username: "Username",
  email: "Email",
  password: "Password",
  otp: "OTP",
};


export const fieldValidator = (fields: string[], req: Request): string | null => {

  for (const field of fields) {

    const value = req.body[field] || null;

    if (value === undefined || value === null || String(value).trim() === "") {

      return shortForm[field] || field;

    }

  }

  return null;

}


export const isValidEmail = (email: string): boolean => {

  const re: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return re.test(email);

}


export const otpGenerator = (): string => {

  const length: number = 6;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const charsLength: number = chars.length;

  const array: Uint32Array = new Uint32Array(length);

  crypto.getRandomValues(array);

  let otp: string = "";

  for (let i = 0; i < length; i++) {
    otp += chars.charAt(array[i] % charsLength);
  }

  return otp;

};



export const randomUsernameGenerator = (name?: string) => {

  const baseName: string = name?.trim().toLowerCase() ?? "User_";

  const randomHex = crypto.randomBytes(6).toString('hex');

  return baseName + randomHex;
}


export const randomPasswordGenerator = (length = 12) => {

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';

  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % chars.length;
    password += chars[index];
  }

  return password;
}