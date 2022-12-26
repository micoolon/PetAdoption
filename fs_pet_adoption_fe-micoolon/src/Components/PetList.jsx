import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import AppContext from "../context/AppContext";
import savePet from "../lib/savePet";
import deleteSavedPet from "../lib/deletSavedPet";
import axios from "axios";

function PetList() {
  const appContext = useContext(AppContext);
  const petList = appContext.petList;
  const user = appContext.user;
  const setUser = appContext.setUser;
  const listChanged = appContext.listChanged;
  const setListChanged = appContext.setListChanged;

  async function fosterPet(seqNumber) {
    const data = await axios.post(
      `http://localhost:4000/pet/${seqNumber}/foster`,
      user.id,
      {
        headers: {
          Authorization: "Bearer " + user.token,
          id: user.id,
        },
      }
    );
    setListChanged(listChanged + 1);
  }

  async function adoptPet(seqNumber) {
    const data = await axios.post(
      `http://localhost:4000/pet/${seqNumber}/adopt`,
      user.id,
      {
        headers: {
          Authorization: "Bearer " + user.token,
          id: user.id,
        },
      }
    );
    setListChanged(listChanged + 1);
  }

  async function handleSave(petId, user) {
    try {
      const result = await savePet(petId, user);
      if (!result.error) {
        setUser((prevState) => ({ ...prevState, savedPets: result }));
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {}
  }
  async function handleDelete(petId, user) {
    try {
      const result = await deleteSavedPet(petId, user);
      if (!result.error) {
        setUser((prevState) => ({ ...prevState, savedPets: result }));
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (user) {
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <div className="list">
      {petList && (
        <>
          {petList.map((petItem) => {
            return (
              <div key={petItem.UID} className="petItem">
                <div className="petItemMeta">
                  <img className="petImage" src={`${petItem.imageUrl}`} />

                  <div className="petItemInfo">
                    <div>
                      <h1>
                        {petItem.name.charAt(0).toUpperCase() +
                          petItem.name.slice(1)}
                      </h1>
                    </div>
                    <div>{petItem.breed}</div>
                    <div className="petItemButtons">
                      {user &&
                        user.savedPets &&
                        user.savedPets.includes(petItem.seqNumber) && (
                          <span
                            className="fa fa-star checked"
                            onClick={async () => {
                              handleDelete(petItem.seqNumber, user);
                            }}
                          ></span>
                        )}
                      {user &&
                        (!user.savedPets ||
                          (user.savedPets &&
                            !user.savedPets.includes(petItem.seqNumber))) && (
                          <span
                            className="fa fa-star"
                            onClick={async () => {
                              handleSave(petItem.seqNumber, user);
                            }}
                          ></span>
                        )}
                      {user && petItem.adoptionStatus === "Available" && (
                        <>
                          {" "}
                          <button
                            className="btn btn-secondary mb-1"
                            onClick={async () => {
                              fosterPet(petItem.seqNumber);
                            }}
                          >
                            Foster
                          </button>
                        </>
                      )}
                      {user && petItem.adoptionStatus !== "Adopted" && (
                        <>
                          {" "}
                          <button
                            className="btn btn-secondary mb-1"
                            onClick={async () => {
                              adoptPet(petItem.seqNumber);
                            }}
                          >
                            Adopt
                          </button>
                        </>
                      )}

                      <Link
                        className="btn btn-secondary mb-1"
                        to={`/Pet/${petItem.seqNumber}`}
                      >
                        More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default PetList;
