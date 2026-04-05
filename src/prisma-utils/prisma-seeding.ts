import db from "./db-client.js";
import authRedis from "../services/redis/auth-redis.js";
import filesQueries from "./files-queries.js";
import { ImageFileType } from "../types/index.js";
import { errorPrinter } from "../errors/error-responder.js";


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
