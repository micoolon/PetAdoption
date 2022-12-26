const SQL = require("@nearform/sql");
const jwt = require("jsonwebtoken");
const { sendQuery } = require("../databases/mysqldb");
require("dotenv").config();

module.exports.authAdminMid = () => {
  return (req, res, next) => {
    try {
      const authheader = req.headers.authorization;
      const token = authheader && authheader.split(" ")[1];

      if (token == null) {
        return res.status(401);
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) return res.status(403);
        const user = await sendQuery(
          SQL`SELECT isAdmin FROM users WHERE id = ${req.headers.id};`
        );
        if (user[0].isAdmin === false || user[0].isAdmin === "false") {
          return res.status(403);
        }
        next();
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
};
