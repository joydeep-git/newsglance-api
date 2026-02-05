import argon2 from 'argon2';
import db from "@/prisma-utils/db-client"
import { UserDataType } from '@/types/auth-types';
import { Request } from 'express';
import { errRouter } from '@/error-handlers/error-responder';
import locationService from "@/services/location/locationService";


const authQueries = {


  async findUser({ value, type = "email", getPassword = false }: {
    value: string;
    type: "email" | "username" | "id";
    getPassword?: boolean;
  }): Promise<UserDataType | null > {

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
      });

    } catch (err) {
      throw errRouter(err);
    }
  },


  async createNewUser({ req, getPassword = false }: { req: Request; getPassword?: boolean; }): Promise<UserDataType> {

    try {

      const { username, email, name, password } = req.body;

      const hashedPassword = await argon2.hash(password);

      let country: string | null = null;

      if (req.ip) {
        country = await locationService.getLocation(req.ip!)
      }

      return await db.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          defaultCountry: country ?? "IN",
        },
        omit: {
          password: !getPassword
        },
        include: {
          avatar: true
        }
      });

    } catch (err) {
      throw errRouter(err);
    }

  },


  async updateSingleValue({ identifier, field, value, getPassword = false }: {
    field: keyof UserDataType;
    value: string;
    identifier: string;
    getPassword?: boolean;
  }) {

    try {

      if (field === "password") {
        value = await argon2.hash(value);
      }

      return await db.user.update({
        where: {
          email: identifier
        },
        data: {
          [field]: value
        },
        omit: {
          password: !getPassword
        }
      })

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
      });

    } catch (err) {
      throw errRouter(err);
    }


  }

}


export default authQueries;