import argon2 from 'argon2';
import db from "./db-client.js"
import { UserDataType } from '../types/auth.js';
import { Request } from 'express';
import { errRouter } from '../errors/error-responder.js';


const authQueries = {


  async findUser({ value, type = "email", getPassword = false }: {
    value: string;
    type: "email" | "username" | "id" | "phoneNumber";
    getPassword?: boolean;
  }): Promise<UserDataType | null> {

    try {

      return await db.user.findFirst({
        where: {
          [type]: value,
        },
        omit: {
          password: !getPassword
        },
        include: {
          avatar: true,
        }
      }) as UserDataType;

    } catch (err) {
      throw errRouter(err);
    }
  },


  async createNewUser({ req, getPassword = false }: { req: Request; getPassword?: boolean; }): Promise<UserDataType> {

    try {

      const { username, email, name, phoneNumber, avatarId, defaultCountry, password } = req.body;

      const hashedPassword = await argon2.hash(password);

      const user: UserDataType = await db.user.create({
        data: {
          username,
          name,
          email,
          phoneNumber,
          avatarId,
          defaultCountry,
          password: hashedPassword,
        },
        omit: {
          password: !getPassword
        },
        include: {
          avatar: true
        }
      }) as UserDataType;

      if (user.password) {
        delete user.password;
      }

      return user;

    } catch (err) {
      throw errRouter(err);
    }

  },


  async updateForgetPassword({ email, newPassword }: {
    email: string;
    newPassword: string;
  }): Promise<UserDataType> {

    try {

      const hashedPassword = await argon2.hash(newPassword);

      return await db.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword
        },
        omit: {
          password: true,
        },
        include: {
          avatar: true,
        }
      }) as UserDataType;

    } catch (err) {
      throw errRouter(err);
    }

  },


  async deleteUser({ id, email }: { id: string; email: string; }): Promise<UserDataType | null> {

    try {

      return await db.user.delete({
        where: {
          id, email
        },
        omit: {
          password: true
        },
        include: {
          avatar: true,
        }
      }) as UserDataType;

    } catch (err) {
      throw errRouter(err);
    }


  }

}


export default authQueries;