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
        include: {
          avatar: true,
        }
      });

      if (data.password) delete data.password;

      return data;

    } catch (err) {
      throw errRouter(err);
    }

  },


  // 
  async updateUserAvatarWithFileDelete({
    newFileUrl,
    file,
    userId,
    oldAvatarId,
  }: {
    newFileUrl: string;
    file: Express.Multer.File;
    userId: string;
    oldAvatarId: string;
  }) {

    return await db.$transaction(async (tx) => {

      // create row in Files table
      const newFile = await tx.file.create({
        data: {
          url: newFileUrl,
          type: "image",
          fileSize: file.size,
          name: file?.originalname,
        }
      });


      // update user with new file data
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { avatarId: newFile.id },
        include: { avatar: true }
      });


      // check and delete old file row
      if (oldAvatarId !== defaultAvatarId) {

        await tx.file.delete({
          where: {
            id: oldAvatarId,
            isDefaultFile: false,
          },
        })

      }

      return updatedUser;

    })

  },


  async deleteAvatar({ id }: { id: string; }): Promise<UserDataType> {

    try {

      const data: UserDataType = await db.user.update({
        where: { id },
        data: {
          avatarId: defaultAvatarId,
        },
        include: {
          avatar: true,
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