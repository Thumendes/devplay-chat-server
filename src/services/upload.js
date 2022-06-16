const multer = require("multer");
const { uploadsPath } = require("../data/constants");
const { createRandomCode } = require("../utils/general");

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, callback) {
      const code = createRandomCode().lowerLetters().numbers().generate(14);
      const original = file.originalname.toLowerCase().replace(/\s/g, "-").trim();
      callback(null, `${code}-${original}`);
    },
    destination(req, file, callback) {
      callback(null, uploadsPath);
    },
  }),
});

module.exports = { upload };
