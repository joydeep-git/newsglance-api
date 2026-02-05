import { errRouter } from "@/error-handlers/error-responder";
import { UserDataType } from "@/types/auth-types";
import { defaultAvatarId } from "@/utils/constants";
import db from "@/prisma-utils/db-client";



const userQueries = {


  async updateUser({ id, data }: { id: string; data: Record<string, string>; }): Promise<UserDataType> {

    try {

      const res: UserDataType = await db.user.update({
        where: { id },
        data,
        include: {
          avatar: true,
        },
      });

      if (res?.password) delete res.password;

      return res;

    } catch (err) {
      throw errRouter(err);
    }

  },


  async updateAvatar({ userId, imageId }: { userId: string; imageId: string; }): Promise<UserDataType> {

    try {

      const data: UserDataType = await db.user.update({
        where: { id: userId },
        data: {
          avatarId: imageId,
        },
      });

      if (data.password) delete data.password;

      return data;

    } catch (err) {
      throw errRouter(err);
    }

  },


  async deleteAvatar({ id }: { id: string; }): Promise<UserDataType> {

    try {

      const data: UserDataType = await db.user.update({
        where: { id },
        data: {
          avatarId: defaultAvatarId,
        }
      });

      if (data?.password) delete data.password;

      return data;

    } catch (err) {
      throw errRouter(err);
    }

  }


}

export default userQueries;