import { errRes, errRouter } from "../error-handlers/error-responder"
import { ImageFileType, StatusCode } from "../types";
import { UserDataType } from "../types/auth-types";
import db from "./db-client";



const userQueries = {


  async updateUser({ id, data }: { id: string; data: Record<string, string>; }): Promise<UserDataType> {

    try {

      return await db.user.update({
        where: { id },
        data,
        // include: {
        //   avatar: true,
        // }
      })

    } catch (err) {
      throw errRouter(err);
    }

  },


  async updateAvatar({ id, imageData }: { id: string; imageData: ImageFileType; }): Promise<UserDataType> {

    try {

      await db.file.create({
        data: {
          ...imageData,
          type: "image"
        }
      });

      const user = await db.user.update({
        where: { id },
        data: {
          avatarId: imageData.id,
        }
      })

      return user;

    } catch (err) {
      throw errRouter(err);
    }

  }

}

export default userQueries;