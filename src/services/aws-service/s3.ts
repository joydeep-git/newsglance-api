import { DeleteObjectCommand, HeadObjectCommand, HeadObjectCommandOutput, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { errRouter } from "@/error-handlers/error-responder";


class CloudStorage {

  private client: S3Client;

  private bucketName: string = process.env.S3_BUCKET_NAME!;

  private region: string = process.env.AWS_REGION!;

  private defaultImageUrl: string = process.env.DEFAULT_AVATAR!

  constructor() {

    if (!this.bucketName || !this.region) throw new Error("AWS ENVs not found!");

    try {

      this.client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        }
      });

    } catch (err) {
      throw errRouter(err);
    }

  }



  public async uploadFile(file: Express.Multer.File, type: "images" | "audio"): Promise<string | null> {

    try {

      const key: string = `${type}/${randomUUID().substring(0, 12)}-${file.originalname}`;

      const data = await this.client.send(
        new PutObjectCommand({
          Key: key,
          Bucket: this.bucketName,
          Body: file.buffer,
          ContentType: file.mimetype
        })
      );

      if (data) {
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      } else {
        return null;
      }

    } catch (err) {
      throw errRouter(err);
    }

  }




  public async fileExists(key: string): Promise<boolean> {

    const data: HeadObjectCommandOutput = await this.client.send(
      new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })
    );

    return data.$metadata.httpStatusCode ? (data.$metadata.httpStatusCode === 200) : false;

  }



  public async deleteFile(url: string): Promise<{ deleted: boolean; message: string; }> {

    try {

      try {

        const parsed = new URL(url);

        const expectedHost = `${this.bucketName}.s3.${this.region}.amazonaws.com`;

        if (parsed.hostname !== expectedHost) return { deleted: false, message: "Invalid URL" };

      } catch (err) {
        return { deleted: false, message: "Invalid URL" };
      }


      if (this.defaultImageUrl && url === this.defaultImageUrl) return {
        deleted: false,
        message: "Default avatar can not be deleted!"
      }

      const key: string = new URL(url).pathname.slice(1);

      const data = await this.client.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }));

      if (data.$metadata.httpStatusCode !== 204) return { deleted: false, message: "File not Deleted!" };

      return {
        deleted: true,
        message: "Avatar removed!"
      }

    } catch (err) {
      throw errRouter(err);
    }

  }


}


const cloudStorage = new CloudStorage();

export default cloudStorage;