import { NextFunction, Request, Response } from "express";
import { errorPrinter, errRes, errRouter } from "@/error-handlers/error-responder";
import { ImageFileType, StatusCode } from "@/types/index";
import userQueries from "@/prisma-utils/user-queries";
import cloudStorage from "@/services/aws-service/s3";
import filesQueries from "@/prisma-utils/files-queries";
import authRedis from "@/services/redis-service/auth-redis";

class UserControllers {


  public async updateUser(req: Request, res: Response, next: NextFunction) {

    try {

      const updates: Record<string, string> = {};

      const validFields = ["username", "name", "defaultCountry"];

      for (const key of validFields) {
        if (req.body[key]) updates[key] = req.body[key];
      }

      if (!Object.keys(updates).length) return next(errRes("No fields to update", StatusCode.BAD_REQUEST));

      const updatedUser = await userQueries.updateUser({ id: req.user.id, data: updates });


      // update redis
      await authRedis.setUserData(updatedUser);


      return res.status(StatusCode.OK).json({
        message: "User data updated!",
        data: updatedUser,
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async updateAvatar(req: Request, res: Response, next: NextFunction) {

    try {

      const file = req.file;

      if (!file) return next(errRes("No file uploaded", StatusCode.BAD_REQUEST));


      // upload file on AWS
      const fileUrl = await cloudStorage.uploadFile(file, "images");

      if (!fileUrl) return next(errRes("File upload failed", StatusCode.BAD_REQUEST));


      // create new file row and update user
      const updatedUser = await userQueries.updateUserAvatarWithFileDelete({
        newFileUrl: fileUrl,
        file,
        userId: req.user.id,
        oldAvatarId: req?.user?.avatar?.id!,
      });



      try {

        // update redis
        await authRedis.setUserData(updatedUser);

        // delete AWS file
        await cloudStorage.deleteFile(req.user.avatar?.url!);

      } catch (err) {
        errorPrinter("Update Avatar cleanup failed!", err);
      }


      return res.status(StatusCode.OK).json({
        message: "Avatar updated!",
        data: updatedUser,
      });

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public deleteAvatar = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const updatedUser = await userQueries.deleteAvatar({ id: req.user.id });

      if (!updatedUser) {
        return next(errRes("Avatar delete failed!", StatusCode.BAD_REQUEST));
      }


      try {

        // update redis
        await authRedis.setUserData(updatedUser);

        // delete AWS file
        await cloudStorage.deleteFile(req.user.avatar?.url!);

      } catch (err) {
        errorPrinter("Delete Avatar cleanup failed!", err);
      }


      return res.status(StatusCode.OK).json({
        message: "Avatar deleted!",
        data: updatedUser,
      });

    } catch (err) {
      return next(errRouter(err));
    }

  }


}


const userControllers = new UserControllers();

export default userControllers;