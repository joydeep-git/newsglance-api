import { NextFunction, Request, Response } from "express";
import { errRes, errRouter } from "@/error-handlers/error-responder";
import { ImageFileType, StatusCode } from "@/types/index";
import userQueries from "@/prisma-utils/user-queries";
import cloudStorage from "@/services/aws-service/s3";
import filesQueries from "@/prisma-utils/files-queries";

class UserControllers {
  public num: number = 1;

  public async updateUser(req: Request, res: Response, next: NextFunction) {

    try {

      const updates: Record<string, string> = {};

      const validFields = ["username", "email", "avatar", "name", "country"];

      for (const key of validFields) {
        if (req.body[key]) updates[key] = req.body[key];
      }

      if (!Object.keys(updates).length) return next(errRes("No fields to update", StatusCode.BAD_REQUEST));

      const updatedUser = await userQueries.updateUser({ id: req.user.id, data: updates });

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

      const fileUrl = await cloudStorage.uploadFile(file, "images");

      if (!fileUrl) return next(errRes("File upload failed", StatusCode.BAD_REQUEST));

      const fileTableRow: ImageFileType = await filesQueries.createNewFile({ file, type: "image", url: fileUrl }) as ImageFileType;

      if (!fileTableRow) return next(errRes("File Table Error!", StatusCode.BAD_REQUEST));

      const updatedUser = await userQueries.updateAvatar({
        userId: req.user.id,
        imageId: fileTableRow.id
      });

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

      const data = await cloudStorage.deleteFile(req.user.avatar?.url!);

      const updatedUser = await userQueries.deleteAvatar({ id: req.user.id });

      return res.status(200).json({
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