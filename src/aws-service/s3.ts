import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { Request } from "express";
import { ImageFileType } from "../types";


class CloudStorage {

  private client: S3ClientConfig;

  private bucketName: string = process.env.S3_BUCKET_NAME!;

  constructor() {

    try {

      this.client = new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        }
      });

    } catch (err) {
      throw err;
    }

  }



  // public uploadFile(req: Request): ImageFileType {

  //   try {

  //     const { file } = req.filter;

  //   } catch (err) {
  //     throw err;
  //   }

  // }



}


const cloudStorage = new CloudStorage();

export default cloudStorage;