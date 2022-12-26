require("dotenv").config();
const cloudinary = require("cloudinary").v2;

module.exports.cloudinaryMid = () => {
  return async (req, res, next) => {
    if (
      req.body.imageUrl &&
      !req.body.imageUrl.includes("http://res.cloudinary.com/")
    ) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(
          req.body.imageUrl,
          function (error, result) {
            req.body.imageUrl = result.url;
          }
        );
        next();
      } catch (err) {
        console.error(err);
        res.status(502).send(err);
      }
    } else {
      next();
    }
  };
};
