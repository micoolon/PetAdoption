const express = require("express");
const router = express.Router();
const Ajv = require("ajv").default;
const ajv = new Ajv();
const S = require("fluent-json-schema");
const { sendQuery } = require("../databases/mysqldb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function getAllUsers() {
  const items = await sendQuery("SELECT * FROM pet_adoption_db.users");
  return items;
}

async function checkPass(user, password) {
  const match = await bcrypt.compare(password, user.password);

  if (match) {
    return true;
  } else return false;
}

const logSchema = S.object()
  .prop("email", S.string().required())
  .prop("password", S.string().required())
  .valueOf();

router.post("/", async (req, res, next) => {
  try {
    const validate = ajv.compile(logSchema);
    const valid = validate(req.body);
    if (!valid) {
      throw new Error("invalid input");
    }
    const allUsers = await getAllUsers();
    const userToLog = req.body;
    let userExists = false;
    let fullUser;

    for (let user of allUsers) {
      if (user.email === userToLog.email) {
        userExists = true;
        fullUser = user;
      }
    }

    const savedPets = await sendQuery(
      `SELECT pet_seqNumber FROM pet_adoption_db.users JOIN pet_adoption_db.savedpets ON (pet_adoption_db.users.id = pet_adoption_db.savedpets.saver_id) WHERE id = ${fullUser.id};`
    );
    let savedPetsArray = [];
    savedPets.forEach((pet) => {
      savedPetsArray.push(pet.pet_seqNumber);
    });
    fullUser.savedPets = savedPetsArray;
    if (!userExists) {
      throw new Error("Invalid Email or Password");
    }
    const correctPass = await checkPass(fullUser, userToLog.password);
    if (fullUser.isAdmin === "false") {
      fullUser.isAdmin = false;
    }
    if (correctPass) {
      const token = jwt.sign(
        {
          data: fullUser.id,
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        token: token,
        id: fullUser.id,
        isAdmin: fullUser.isAdmin,
        first_name: fullUser.first_name,
        last_name: fullUser.last_name,
        savedPets: fullUser.savedPets,
      });
    } else if (!correctPass) {
      throw new Error("Incorrect Password");
    }
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

module.exports = router;
