const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.authenticationMid = () => {
  return (req, res, next) => {
    try {
      const authheader = req.headers.authorization;
      const token = authheader && authheader.split(" ")[1];

      if (token == null) {
        return res.status(401);
      }
      jwt.verify(
        `${token}`,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            return res.status(403);
          } else {
            next();
          }
        }
      );
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
};
