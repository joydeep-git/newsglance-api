import multer from "multer";


class MulterConfig {


  public upload = multer({

    storage: multer.memoryStorage(),

    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },

    fileFilter(req, file, cb) {

      if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only images allowed"));
      }

      cb(null, true);
    },
  });
}

const multerConfig = new MulterConfig();

export default multerConfig;