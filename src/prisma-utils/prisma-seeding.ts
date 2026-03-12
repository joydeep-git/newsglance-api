import db from "@/prisma-utils/db-client";
import authRedis from "@/services/redis-service/auth-redis";
import filesQueries from "./files-queries";
import { ImageFileType } from "@/types";
import { errorPrinter } from "@/errors/error-responder";


const prismaSeeding = async () => {


  const file = await db.file.findFirst({
    where: { isDefaultFile: true, type: "image" }
  });

  if (file) {
    await authRedis.setDefaultAvatarId(file.id);
    return errorPrinter("Prisma Seeding", "File exists!");
  }


  const newFile: ImageFileType = await filesQueries.createDefaultFile();

  if (newFile) {

    await authRedis.setDefaultAvatarId(newFile.id);

    errorPrinter("Prisma Seeding:", "File created!");

  } else {
    errorPrinter("Prisma Seeding ERROR:", "File creation failed!");
  }

}


export default prismaSeeding;
