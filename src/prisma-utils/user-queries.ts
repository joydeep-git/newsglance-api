import { errRouter } from "../errors/error-responder";
import { UserDataType } from "../types/auth";
import db from "./db-client";
import authRedis from "../services/redis/auth-redis";



const userQueries = {


  async updateUser({ id, data }: { id: string; data: Record<string, string | number>; }): Promise<UserDataType> {

    try {

      const res: UserDataType = await db.user.update({
        where: { id },
        data,
        include: {
          avatar: true,
        },
      }) as UserDataType;

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
      }) as UserDataType;

      if (data.password) delete data.password;

      return data;

    } catch (err) {
      throw errRouter(err);
    }

  },


  // Create new File Row + Update User + Delete old file row
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
          name: file.originalname,
        }
      });


      // update user with new file data
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { avatarId: newFile.id },
        include: { avatar: true }
      });


      const oldFile = await tx.file.findFirst({
        where: { id: oldAvatarId, isDefaultFile: false }
      });


      // delete old file only if its not default
      if (oldFile) {
        await tx.file.delete({
          where: { id: oldAvatarId },
        });
      }

      return updatedUser;

    })

  },


  async deleteAvatar({ id }: { id: string; }): Promise<UserDataType> {

    try {

      const defaultId = await authRedis.getDefaultAvatarId();

      const data: UserDataType = await db.user.update({
        where: { id },
        data: {
          avatarId: defaultId,
        },
        include: {
          avatar: true,
        }
      }) as UserDataType;

      if (data?.password) delete data.password;

      return data;

    } catch (err) {
      throw errRouter(err);
    }

  },



  async resetLimit() {

    await db.user.updateMany({
      where: {
        OR: [
          {
            planExpiryDate: {
              lte: new Date() // expiry date was in past
            }
          },
          {
            planExpiryDate: null // never had a plan
          }
        ]
      },
      data: {
        isPremium: false,
        newsBalance: 2,
        audioBalance: 2
      },
    });

  }


}

export default userQueries;