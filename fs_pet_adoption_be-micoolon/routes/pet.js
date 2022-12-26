const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Ajv = require("ajv").default;
const ajv = new Ajv();
const S = require("fluent-json-schema");
const { sendQuery } = require("../databases/mysqldb");
const SQL = require("@nearform/sql");
const { authenticationMid } = require("../middleware/authentication");
const { authAdminMid } = require("../middleware/authenticateAdmin");
const { cloudinaryMid } = require("../middleware/cloudUpload");
const { cloudinary } = require("../other/cloudinary");

async function getAllPets() {
  const items = await sendQuery("SELECT * FROM pet_adoption_db.pets");
  return items;
}

async function adoptPet(petNum, userId) {
  try {
    await sendQuery(
      SQL`UPDATE pet_adoption_db.pets SET adoptionStatus = "Adopted", ownerId = ${userId} WHERE seqNumber = ${petNum}`
    );
    return "Pet Adopted Successfully!";
  } catch (err) {
    throw new Error(err);
  }
}

async function fosterPet(petNum, userId) {
  try {
    await sendQuery(
      SQL`UPDATE pet_adoption_db.pets SET adoptionStatus = "Fostered", ownerId = ${userId} WHERE seqNumber = ${petNum}`
    );
    return "Pet Fostered Successfully!";
  } catch (err) {
    throw new Error(err);
  }
}

async function addPet(pet) {
  try {
    pet.bio = pet.bio ? pet.bio : null;
    pet.color = pet.color ? pet.color : null;
    pet.diet = pet.diet ? pet.diet : null;
    const results = await sendQuery(
      `INSERT INTO pet_adoption_db.pets (animalType, breed, name, UID, height, weight, imageUrl, isHypo, bio, color, diet, adoptionStatus, ownerId) VALUES ("${
        pet.animalType
      }", "${pet.breed}", "${pet.animalName}", "${pet.UID}",${parseInt(
        pet.height
      )}, ${parseInt(pet.weight)}, "${pet.imageUrl}", ${pet.isHypo}, "${
        pet.bio
      }", "${pet.color}","${pet.diet}", "${pet.adoptionStatus}", null)`
    );
    return results;
  } catch (err) {
    if (err.errno === 1054) {
      throw new Error("Wrong structure");
    }
    throw new Error(err);
  }
}

async function preparePet(pet) {
  let petToUpdate = {};
  const entries = Object.entries(pet);
  for (let property of entries) {
    if (property[1] !== "") {
      const key = property[0];
      const value = property[1];
      petToUpdate[key] = value;
    }
  }
  return petToUpdate;
}

async function updatePet(pet, id) {
  let sqlUpdate = [];
  try {
    if (pet.breed && pet.breed !== "Breed") {
      sqlUpdate.push(SQL`breed = ${pet.breed}`);
    }
    if (pet.name) {
      sqlUpdate.push(SQL`name = ${pet.name}`);
    }
    if (pet.height) {
      sqlUpdate.push(SQL`height = ${pet.height}`);
    }
    if (pet.width) {
      sqlUpdate.push(SQL`width = ${pet.width}`);
    }
    if (pet.imageUrl) {
      sqlUpdate.push(SQL`imageUrl = ${pet.imageUrl}`);
    }
    if (pet.isHypo) {
      sqlUpdate.push(SQL`isHypo = ${pet.isHypo}`);
    }
    if (pet.bio) {
      sqlUpdate.push(SQL`bio = ${pet.bio}`);
    }
    if (pet.color) {
      sqlUpdate.push(SQL`color = ${pet.color}`);
    }
    if (pet.diet) {
      sqlUpdate.push(SQL`diet = ${pet.diet}`);
    }
    try {
      let queryResult;
      if (sqlUpdate.length >= 1) {
        queryResult = await sendQuery(
          SQL`UPDATE 
            pet_adoption_db.pets
            SET 
         ${SQL.glue(sqlUpdate, ", ")}
            WHERE 
            seqNumber = ${id};`
        );
      } else {
        return "No details to update";
      }
      res.send(queryResult);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// Main Search
router.get("/", async (req, res, next) => {
  let sqlUpdate = [];
  try {
    if (req.query.pet_type && req.query.pet_type !== "Animal") {
      sqlUpdate.push(SQL`animalType LIKE ${"%" + req.query.pet_type + "%"}`);
    }
    if (req.query.pet_name) {
      sqlUpdate.push(SQL`name LIKE ${"%" + req.query.pet_name + "%"}`);
    }
    if (req.query.pet_breed && req.query.pet_breed !== "Breed") {
      sqlUpdate.push(SQL`breed LIKE ${"%" + req.query.pet_breed + "%"}`);
    }
    if (
      !req.query.pet_status ||
      (req.query.pet_status && req.query.pet_status === "Adoption Status")
    ) {
      sqlUpdate.push(
        SQL`(adoptionStatus = "Available" OR adoptionStatus = "Fostered")`
      );
    }
    if (req.query.pet_status && req.query.pet_status === "Foster") {
      sqlUpdate.push(SQL`adoptionStatus = "Available"`);
    }
    if (req.query.pet_status && req.query.pet_status === "Adopt") {
      sqlUpdate.push(
        SQL`(adoptionStatus = "Available" OR adoptionStatus = "Fostered")`
      );
    }
    if (req.query.pet_minheight || req.query.pet_maxheight) {
      sqlUpdate.push(
        SQL`height BETWEEN ${
          req.query.pet_minheight ? req.query.pet_minheight : 0
        } AND ${req.query.pet_maxheight ? req.query.pet_maxheight : 0}`
      );
    }
    if (req.query.pet_minweight || req.query.pet_maxweight) {
      sqlUpdate.push(
        SQL`weight BETWEEN ${
          req.query.pet_minweight ? req.query.pet_minweight : 0
        } AND ${req.query.pet_maxweight ? req.query.pet_maxweight : 0}`
      );
    }
    try {
      let queryResult;
      if (sqlUpdate.length >= 1) {
        queryResult = await sendQuery(
          SQL`SELECT * FROM pets WHERE ${SQL.glue(sqlUpdate, "and ")}`
        );
      } else {
        queryResult = await sendQuery(
          SQL`SELECT * FROM pets WHERE adoptionStatus != "Adopted"`
        );
      }
      res.send(queryResult);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Get all pets (for admin dashboard)
router.get("/all", authAdminMid(), async (req, res, nextStep) => {
  try {
    const pets = await getAllPets();
    res.send(pets);
  } catch (error) {
    nextStep(error);
  }
});

// Get pet by ID
router.get("/:id", async (req, res, nextStep) => {
  try {
    const petId = req.params.id;
    const chosenPet = await sendQuery(
      SQL`SELECT * FROM pets WHERE seqNumber = ${petId}`
    );
    res.send(chosenPet);
  } catch (error) {
    nextStep(error);
  }
});

// Get all pets of specific user by user ID
router.get("/user/:id", async (req, res, nextStep) => {
  try {
    const userId = req.params.id;
    const userPets = await sendQuery(
      SQL`SELECT * FROM pets WHERE ownerId = ${userId}`
    );
    res.send(userPets);
  } catch (error) {
    nextStep(error);
  }
});

// Adopt pet
router.post("/:id/adopt", authenticationMid(), async (req, res, nextStep) => {
  try {
    const petId = req.params.id;
    const userId = req.headers.id;
    const chosenPet = await sendQuery(
      SQL`SELECT * FROM pets WHERE seqNumber = ${petId}`
    );
    if (chosenPet[0].adoptionStatus === "Adopted") {
      throw new Error("Pet Already Adopted!");
    }
    const currentUser = await sendQuery(
      SQL`SELECT * FROM users WHERE id = ${userId}`
    );
    if (currentUser.length === 0) {
      throw new Error("User Not Found");
    }
    const adoption = adoptPet(petId, userId);
    res.send(adoption);
  } catch (error) {
    nextStep(error);
  }
});

// Foster pet
router.post("/:id/foster", authenticationMid(), async (req, res, nextStep) => {
  try {
    const petId = req.params.id;
    const userId = req.headers.id;
    const chosenPet = await sendQuery(
      SQL`SELECT * FROM pets WHERE seqNumber = ${petId}`
    );
    if (chosenPet[0].adoptionStatus === "Adopted") {
      throw new Error("Pet Already Adopted!");
    } else if (chosenPet[0].adoptionStatus === "Fostered") {
      throw new Error("Pet Already Fostered!");
    } else {
      const currentUser = await sendQuery(
        SQL`SELECT * FROM users WHERE id = ${userId}`
      );
      if (currentUser.length === 0) {
        throw new Error("User Not Found");
      } else {
        const foster = fosterPet(petId, userId);
        res.send(foster);
      }
    }
  } catch (error) {
    nextStep(error);
  }
});

// Return pet
router.put("/:id/return", authenticationMid(), async (req, res, nextStep) => {
  try {
    const petId = req.params.id;
    const queryResult = await sendQuery(
      SQL`UPDATE 
        pet_adoption_db.pets
        SET 
        adoptionStatus = "Available",
        ownerId = ${null}
        WHERE 
        seqNumber = ${petId};`
    );
    res.send(queryResult);
  } catch (error) {
    nextStep(error);
  }
});

// Save pet to favorites
router.post("/:id/save", authenticationMid(), async (req, res, nextStep) => {
  try {
    const petId = req.params.id;
    user = req.body;

    const userId = user.id;
    try {
      await sendQuery(
        SQL`INSERT INTO pet_adoption_db.savedpets VALUES (${userId},${petId});`
      );
      if (user.savedPets) {
        user.savedPets.push(Number(petId));
      } else {
        user.savedPets = [Number(petId)];
      }
      res.send(user.savedPets);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    nextStep(error);
  }
});

// Remove pet from favorites
router.delete("/:id/save", authenticationMid(), async (req, res, nextStep) => {
  try {
    const petId = req.params.id;
    user = req.body.user;
    const userId = user.id;
    try {
      await sendQuery(
        SQL`DELETE FROM pet_adoption_db.savedpets WHERE saver_id = ${userId} AND pet_seqNumber = ${petId} ;`
      );
      const index = user.savedPets.indexOf(Number(petId));
      if (index > -1) {
        user.savedPets.splice(index, 1);
      }
      res.send(user.savedPets);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    nextStep(error);
  }
});

//Add a pet
router.post("/", authAdminMid(), cloudinaryMid(), async (req, res, next) => {
  try {
    const validate = ajv.compile(petSchema);
    const valid = validate(req.body);
    if (!valid) {
      throw new Error("invalid input");
    }
    const newPet = req.body;
    newPet.UID = uuidv4();

    await addPet(newPet);
    res.send("success");
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

// Update pet by ID
router.put("/:id", authAdminMid(), cloudinaryMid(), async (req, res, next) => {
  try {
    const petId = req.params.id;

    const updates = req.body;

    const petToUpdate = await preparePet(updates);
    await updatePet(petToUpdate, petId);
    const chosenPet = await sendQuery(
      SQL`SELECT * FROM users WHERE id = ${petId}`
    );
    res.send(chosenPet[0]);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

const petSchema = S.object()
  .prop("animalType", S.string().required())
  .prop("animalName", S.string().required())
  .prop("breed", S.string().required())
  .prop("height", S.string().required())
  .prop("weight", S.string().required())
  .prop("imageUrl", S.string().required())
  .valueOf();

module.exports = router;
