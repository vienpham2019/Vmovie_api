const path = require("path");
const { UnprocessableEntityError } = require("../core/error.response");

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const { files } = req;
    const fileExtensions = [];
    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });

    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );
    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files allowed`.replace(
          ",",
          ", "
        );
      throw new UnprocessableEntityError(message);
    }
    next();
  };
};

module.exports = fileExtLimiter;
