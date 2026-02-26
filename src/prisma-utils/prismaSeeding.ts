import db from "@/prisma-utils/db-client";
import authRedis from "@/services/redis-service/auth-redis";
import filesQueries from "./files-queries";
import { ImageFileType } from "@/types";


const prismaSeeding = async () => {


  const file = await db.file.findFirst({
    where: { isDefaultFile: true, type: "image" }
  });

  if (file) {
    await authRedis.setDefaultAvatarId(file.id);
    return console.log("Prisma Seeding : File exists!");
  }


  const newFile: ImageFileType = await filesQueries.createDefaultFile();

  if (newFile) {

    await authRedis.setDefaultAvatarId(newFile.id);
    
    console.log("Prisma Seeding : File created!");
  
  } else {
    console.log("Prisma Seeding ERROR : File creation failed!");
  }

}


export default prismaSeeding;
