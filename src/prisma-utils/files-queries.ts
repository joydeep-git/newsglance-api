import { errRouter } from "@/error-handlers/error-responder";
import { AudioFileType, ImageFileType } from "@/types/index";
import db from "@/prisma-utils/db-client";
import { defaultAvatarId, defaultAvatarUrl } from "@/utils/constants";


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

      if ( value === defaultAvatarId || value === defaultAvatarUrl ) return null;

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