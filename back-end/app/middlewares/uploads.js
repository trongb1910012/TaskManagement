const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Định dạng tên tệp theo ý bạn, ví dụ: ngày-gio-ten-tap-tin-nguon
    const originalname = file.originalname;
    const ext = path.extname(originalname);
    const timestamp = Date.now();
    const formattedFilename = `${timestamp}-${originalname}`;

    cb(null, formattedFilename);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    // Cho phép tất cả các loại tệp tin
    callback(null, true);
  },
});

module.exports = upload;
