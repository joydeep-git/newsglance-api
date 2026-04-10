
export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  PAYLOAD_TOO_LARGE = 413,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
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


export type ContactUsDataType = {
  name: string;
  email: string;
  subject: string;
  message: string;
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



export interface FileDataType{
  id: string;
  name: string;
  url: string;
  fileSize: number;
  createdAt: Date;
  isDefaultFile: boolean;
  duration?: number | null;
};


export interface ImageFileType extends FileDataType {
  type: "image";
}

export interface AudioFileType extends FileDataType {
  type: "audio";
}


export type FileCreateType = {
  url: string;
  file: {
    size: number;
    originalname?: string; 
    filename?: string;
    duration?: number;
  };
  type: "image" | "audio";
}



export type CountryMapType = {
  name: string;
  countrycode: string;
  currency: string;
  flag: string;
}


export type FuelPriceResponseType = {
  "city": string,
  "price": string,
  "change": string
}

export type fuelRedisType = {
  type: "petrol" | "diesel";
  data: FuelPriceResponseType[]
}



export type GeminiErrorType = {
  status?: number;
  message?: string;
  code?: number | string;
  errorDetails?: { reason?: string }[];
}