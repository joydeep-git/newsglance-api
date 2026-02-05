import { NextFunction, Request, Response } from "express";
import { errRes, errRouter } from "@/error-handlers/error-responder";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { StatusCode } from "@/types";
import authQueries from "@/prisma-utils/auth-queries";
import { randomPasswordGenerator, randomUsernameGenerator } from "@/utils/helper-functions";
import authToken from "@/middleware/auth-token";



class AuthGoogleController {

  private googleClient: OAuth2Client;

  constructor() {

    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  }


  public authorize = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const { googleToken } = await req.body;

      if (!googleToken) {
        return next(errRes("Google Token not found!", StatusCode.BAD_REQUEST));
      }

      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload: TokenPayload | undefined = ticket.getPayload();

      if (!payload) {

        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "Error verifying google account!"
        })

      } else {

        // find user
        const user = await authQueries.findUser({ type: "email", value: payload.email!, getPassword: false });

        if (!user) {

          const body = {
            username: randomUsernameGenerator(payload.given_name),
            email: payload.email,
            name: payload.name,
            password: randomPasswordGenerator(),
          }

          req.body = body;

          const newUser = await authQueries.createNewUser({
            getPassword: false,
            req
          });

          const token = authToken.cookieGenerator(newUser.id);

          if (!token) return next(errRes("Unable to login! Please try again.", StatusCode.INTERNAL_SERVER_ERROR));

          return res.status(StatusCode.CREATED)
            .cookie("token", token, authToken.cookieConfig())
            .json(
              {
                message: "Account created!",
                data: newUser
              }
            )

        } else {

          const getUser = await authQueries.findUser({ type: "email", getPassword: false, value: payload.email! });

          const token = authToken.cookieGenerator(getUser?.id!);

          if (!token) return next(errRes("Unable to login! Please try again.", StatusCode.INTERNAL_SERVER_ERROR));

          const userWithoutPassword = { ...user };

          delete userWithoutPassword.password;

          return res
            .status(StatusCode.OK)
            .cookie("token", token, authToken.cookieConfig())
            .json(
              {
                message: "Logged in successfully!",
                data: userWithoutPassword,
              }
            )

        }

      }

    } catch (err) {
      return next(errRouter(err));
    }
  }

}

const authGoogleController = new AuthGoogleController();

export default authGoogleController;