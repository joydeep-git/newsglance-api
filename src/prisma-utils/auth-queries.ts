import argon2 from 'argon2';
import db from "./db-client"
import { UserDataType } from '../types/auth-types';
import { Request } from 'express';
import { errRouter } from '../error-handlers/error-responder';


const authQueries = {


  async findUser({ value, type = "email" }: { value: string; type: "email" | "username" | "id"; }): Promise<UserDataType | null> {

    try {
      
      let user: UserDataType | null = null;

      user = await db.user.findFirst({
        where: {
          [type]: value,
        },
      })

      return user;

    } catch (err) {
      throw errRouter(err);
    }
  },


  async createNewUser(req: Request): Promise<UserDataType> {

    try {

      const { username, email, name, password } = await req.body;

      const hashedPassword = await argon2.hash(password);

      const newUser = await db.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword
        }
      });

      return newUser;

    } catch (err) {
      throw errRouter(err);
    }

  },



  async updateSingleValue({ userId, field, value }: { field: keyof UserDataType; value: string; userId: string; }) {

    try {

      if (field === "password") {
        value = await argon2.hash(value);
      }

      return await db.user.update({
        where: {
          id: userId,
        },
        data: {
          [field]: value
        }
      })

    } catch (err) {
      throw errRouter(err);
    }

  }

}


export default authQueries;