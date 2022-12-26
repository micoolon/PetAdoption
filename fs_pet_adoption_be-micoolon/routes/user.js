const express = require("express");
const router = express.Router();
const { sendQuery } = require("../databases/mysqldb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const SQL = require("@nearform/sql");
const { authenticationMid } = require("../middleware/authentication");
const { authAdminMid } = require("../middleware/authenticateAdmin");

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

async function prepareUser(user) {
  let userToUpdate = {};
  const entries = Object.entries(user);
  for (let property of entries) {
    if (property[1] !== "") {
      const key = property[0];
      const value = property[1];
      userToUpdate[key] = value;
    }
  }
  return userToUpdate;
}

async function updateUser(user, id) {
  let sqlUpdate = [];
  try {
    if (user.email) {
      sqlUpdate.push(SQL`email = ${user.email}`);
    }
    if (user.password) {
      sqlUpdate.push(SQL`password = ${user.password}`);
    }
    if (user.fName) {
      sqlUpdate.push(SQL`first_name = ${user.fName}`);
    }
    if (user.lName) {
      sqlUpdate.push(SQL`last_name = ${user.lName}`);
    }
    if (user.phone) {
      sqlUpdate.push(SQL`phone = ${user.phone}`);
    }
    if (user.bio) {
      sqlUpdate.push(SQL`bio = ${user.bio}`);
    }
    try {
      let queryResult;
      if (sqlUpdate.length >= 1) {
        queryResult = await sendQuery(
          SQL`UPDATE 
            pet_adoption_db.users
            SET 
         ${SQL.glue(sqlUpdate, ", ")}
            WHERE 
            id = ${id};`
        );
      } else {
        return "No details to update";
      }
      return queryResult;
    } catch (error) {}
  } catch (error) {
    next(error);
  }
}

// Get all users
router.get("/", authAdminMid(), async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    res.send(allUsers);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

// Update user by ID
router.put("/:id", authenticationMid(), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const authheader = req.headers.authorization;
    const token = authheader && authheader.split(" ")[1];
    const allUsers = await getAllUsers();
    const updates = req.body;
    let alreadyIn = false;
    if (updates.email && updates.email !== "") {
      for (let user of allUsers) {
        if (user.email === updates.email) {
          alreadyIn = true;
        }
      }
    }

    if (alreadyIn) {
      throw new Error("user already in system");
    }

    if (updates.password && updates.password !== "") {
      const saltedPass = await encrypt(updates.password);
      updates.password = saltedPass;
    }
    const userToUpdate = await prepareUser(updates);
    await updateUser(userToUpdate, userId);
    const chosenUser = await sendQuery(
      SQL`SELECT * FROM users WHERE id = ${userId}`
    );
    res.json({
      token: token,
      id: chosenUser[0].id,
      isAdmin: chosenUser[0].isAdmin,
      first_name: chosenUser[0].first_name,
      last_name: chosenUser[0].last_name,
      savedPets: chosenUser[0].savedPets,
    });
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

module.exports = router;
