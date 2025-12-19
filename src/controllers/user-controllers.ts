import { NextFunction, Request, Response } from "express";
import { errRes, errRouter } from "../error-handlers/error-responder";
import { StatusCode } from "../types";
import authQueries from "../prisma-utils/auth-queries";
import userQueries from "../prisma-utils/user-queries";


class UserControllers {

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


  public async updateAvatar() {

    

  }



}


const userControllers = new UserControllers();

export default userControllers;