import multer from 'multer';

export default {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "upload/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    }
  })
}
