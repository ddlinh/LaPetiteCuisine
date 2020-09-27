const path = require("path");
var multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require('uuid');


// config stoge
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "tmp/my-uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

const storage = new Storage({
  projectId: "la-petite-cuisine",
  keyFilename:
    "configs/la-petite-cuisine-firebase-adminsdk-xqouu-8f04877c72.json",
});
const bucket = storage.bucket("gs://la-petite-cuisine.appspot.com");

var upload = multer({ storage: multer.memoryStorage() });

const UploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) reject("File not found");

    const fileUpload = bucket.file(file.originalname); // file.originalname == image.jpg

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (error) => reject(error));
    stream.on("finish", () => {
      // console.log("finish");
      // getSignedUrl

      fileUpload
        .getSignedUrl({ action: "read", expires: "09-19-2100" })
        .then((urls) => resolve(urls[0]));

      // resolve({ message: "Success" });
    });
    stream.end(file.buffer);
  });
};


////// local upload
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const localUpload = multer({ storage: localStorage })



module.exports = { upload, UploadImageToStorage, localUpload };
