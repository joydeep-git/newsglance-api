import { errRouter } from "@/errors/error-responder";
import { AudioFileType, ImageFileType } from "@/types/index";
import db from "@/prisma-utils/db-client";


class FilesQueries {


  public async createNewFile({ url, file, type }: { url: string; file: Express.Multer.File; type: "image" | "audio"; }): Promise<ImageFileType | AudioFileType> {

    try {

      return await db.file.create({
        data: {
          url,
          type,
          fileSize: file.size,
          name: file.originalname || file.filename,
        }
      });

    } catch (err) {
      throw errRouter(err);
    }

  }


  public async createDefaultFile(): Promise<ImageFileType> {

    try {
      const newFile: ImageFileType = await db.file.create({
        data: {
          url: "https://newsglance-s3.s3.ap-south-1.amazonaws.com/default.jpg",
          type: "image",
          fileSize: 259200,
          name: "defaut.jpg",
          isDefaultFile: true,
        }
      }) as ImageFileType;

      return newFile;
    } catch (err) {
      throw errRouter(err);
    }

  }


  public async findDefaultFile(): Promise<ImageFileType> {

    try {
      return await db.file.findFirstOrThrow({
        where: {
          isDefaultFile: true,
          type: "image"
        }
      }) as ImageFileType;
    } catch (err) {
      throw errRouter(err);
    }

  }



  public async findFileRow({ type, value }: { type: "id" | "url"; value: string; }): Promise<ImageFileType | AudioFileType | null> {

    try {

      return await db.file.findFirst({
        where: {
          [type]: value
        }
      })

    } catch (err) {
      throw errRouter(err);
    }

  }



  public async deleteFileRow({ type, value }: { type: "id" | "url"; value: string; }) {

    try {

      const key = type === "id" ? { id: value } : { url: value };

      return await db.file.delete({
        where: {
          ...key,
          isDefaultFile: false
        },
      });

    } catch (err) {
      throw errRouter(err);
    }

  }

}


const filesQueries = new FilesQueries();

export default filesQueries;