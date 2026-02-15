import { extname } from "path";


export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  PAYLOAD_TOO_LARGE= 413,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE= 503,
}


export type EmailSendResponse = {
  accepted: string[];
  rejected: string[];
  ehlo: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
    from: string;
    to: string[];
  };
  messageId: string;
}



export type TokenCreateResponseType = {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  sameSite: "lax" | "none"
}



export interface GeolocationData {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}



export interface FileDataType {
  id: string;
  name: string;
  url: string;
  fileSize: number;
  createdAt: Date;
  type: "image" | "audio";
  isDefaultFile: boolean;
};


export interface ImageFileType extends FileDataType {
  type: "image";
  id: string;
  name: string;
  url: string;
  fileSize: number;
  createdAt: Date;
} 

export interface AudioFileType extends FileDataType {
  type: "audio";
  id: string;
  name: string;
  url: string;
  fileSize: number;
  createdAt: Date;
}
