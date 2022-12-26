const express = require("express");
const router = express.Router();
const Ajv = require("ajv").default;
const ajv = new Ajv();
const S = require("fluent-json-schema");
const { sendQuery } = require("../databases/mysqldb");
const SQL = require("@nearform/sql");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function getAllUsers() {
  const items = await sendQuery("SELECT * FROM pet_adoption_db.users");
  return items;
}

async function encrypt(password) {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

async function addUser(user) {
  try {
    await sendQuery(
      `INSERT INTO pet_adoption_db.users (first_name, last_name,email,password,phone,isAdmin,bio) VALUES ('${
        user.fName
      }','${user.lName}','${user.email}','${user.password}','${user.phone}', '${
        user.isAdmin
      }', '${null}')`
    );
    const results = await sendQuery(
      `SELECT * FROM pet_adoption_db.users WHERE email = "${user.email}" `
    );
    return results;
  } catch (err) {
    if (err.errno === 1054) {
      throw new Error("Wrong structure");
    }
    throw new Error(err);
  }
}

router.get("/", async (req, res, next) => {
  //Send list of the users
  try {
    const allUsers = await getAllUsers();
    res.send(allUsers);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  //Add a user
  try {
    const validate = ajv.compile(userSchema);
    const valid = validate(req.body) && req.body.isAdmin === false;
    if (!valid) {
      throw new Error("invalid input");
    }
    const allUsers = await getAllUsers();
    const newUser = req.body;
    let alreadyIn = false;

    for (let user of allUsers) {
      if (user.email === newUser.email) {
        alreadyIn = true;
      }
    }

    if (alreadyIn) {
      throw new Error("user already in system");
    }
    const saltedPass = await encrypt(newUser.password);
    newUser.password = saltedPass;
    const result = await addUser(newUser);
    res.send(result);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

const userSchema = S.object()
  .prop("email", S.string().required())
  .prop("password", S.string().required())
  .prop("fName", S.string().required())
  .prop("lName", S.string().required())
  .prop("phone", S.string().maxLength(10).minLength(9).required())
  .valueOf();

module.exports = router;
