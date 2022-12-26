import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../context/AppContext";
import axios from "axios";
import EditPet from "./EditPet";
import savePet from "../lib/savePet";
import deleteSavedPet from "../lib/deletSavedPet";

function Pet() {
  const appContext = useContext(AppContext);
  const user = appContext.user;
  const setUser = appContext.setUser;
  const setPetToEdit = appContext.setPetToEdit;
  const [errorMessage, setErrorMessage] = useState();
  const [currentPet, setCurrentPet] = useState();
  const [editOpened, setEditOpened] = useState(false);
  let { id } = useParams();

  const openEdit = () => {
    setEditOpened(!editOpened);
  };

  const handleReturn = async () => {
    setErrorMessage(undefined);
    const result = await axios
      .put(`http://localhost:4000/pet/${id}/return`, user.id, {
        headers: {
          Authorization: "Bearer " + user.token,
          id: user.id,
        },
      })
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        return error.response.data;
      });
    if (typeof result === "string") {
      setErrorMessage(result);
    } else {
      setErrorMessage("Pet Returned Successfully");
      getPet();
    }
  };

  const getPet = () => {
    axios.get(`http://localhost:4000/pet/${id}`).then((response) => {
      if (response.data.length === 0) {
        setErrorMessage("No Pet Found!");
      } else {
        setCurrentPet(...response.data);
      }
    });
  };

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
    getPet();
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
    getPet();
  }

  async function handleSave(petId, user) {
    try {
      const result = await savePet(petId, user);
      if (result.error) {
      } else {
        setUser((prevState) => ({ ...prevState, savedPets: result }));
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      setErrorMessage(error);
    }
  }

  async function handleDelete(petId, user) {
    try {
      const result = await deleteSavedPet(petId, user);
      if (result.error) {
        setErrorMessage(result);
      } else {
        setUser((prevState) => ({ ...prevState, savedPets: result }));
      }
    } catch (error) {
      setErrorMessage(error);
    }
  }

  useEffect(() => {
    getPet();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (currentPet) {
      setPetToEdit({ id: id, animalType: currentPet.animalType });
    }
  }, [currentPet]);
  return (
    <>
      <div className="errorMessage">{errorMessage}</div>
      {currentPet && (
        <>
          <div className="petPageContainer">
            <div className="petPageCard">
              <h1 style={{ color: "steelblue" }}>
                {currentPet.name.charAt(0).toUpperCase() +
                  currentPet.name.slice(1)}
              </h1>
              <div>
                {user &&
                  user.savedPets &&
                  user.savedPets.includes(currentPet.seqNumber) && (
                    <span
                      className="fa fa-star checked"
                      onClick={async () => {
                        handleDelete(currentPet.seqNumber, user);
                      }}
                    ></span>
                  )}
                {user &&
                  (!user.savedPets ||
                    (user.savedPets &&
                      !user.savedPets.includes(currentPet.seqNumber))) &&
                  currentPet.adoptionStatus !== "Adopted" && (
                    <span
                      className="fa fa-star"
                      onClick={async () => {
                        handleSave(currentPet.seqNumber, user);
                      }}
                    ></span>
                  )}
              </div>
              <img className="petPageImage" src={`${currentPet.imageUrl}`} />
              <div>
                {user && currentPet.ownerId === user.id && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to return the pet?"
                        )
                      )
                        handleReturn();
                    }}
                    className="btn btn-primary"
                  >
                    Return Pet
                  </button>
                )}
              </div>
              {user && currentPet.adoptionStatus === "Available" && (
                <>
                  {" "}
                  <button
                    className="btn btn-secondary mb-1"
                    onClick={async () => {
                      fosterPet(currentPet.seqNumber);
                    }}
                  >
                    Foster
                  </button>
                </>
              )}
              {user && currentPet.adoptionStatus !== "Adopted" && (
                <>
                  {" "}
                  <button
                    className="btn btn-secondary mb-1"
                    onClick={async () => {
                      adoptPet(currentPet.seqNumber);
                    }}
                  >
                    Adopt
                  </button>
                </>
              )}
              <h4>Breed: {currentPet.breed}</h4>
              <h4>Height: {currentPet.height} CM</h4>
              <h4>Weight: {currentPet.weight} KG</h4>
              <h4>Adoption Status: {currentPet.adoptionStatus}</h4>
              {currentPet.isHypo === 1 && <h4>Hypoallergenic: Yes!</h4>}
              {(!currentPet.isHypo || currentPet.isHypo === "0") && (
                <h4>Hypoallergenic: No</h4>
              )}
              {currentPet.color &&
                currentPet.color !== "" &&
                currentPet.color !== "null" && (
                  <h4>Color: {currentPet.color}</h4>
                )}
              {currentPet.diet &&
                currentPet.diet !== "" &&
                currentPet.diet !== "null" && (
                  <h4>Dietary Restrictions: {currentPet.diet}</h4>
                )}
              {currentPet.bio &&
                currentPet.bio !== "" &&
                currentPet.bio !== "null" && <h4>Bio: {currentPet.bio}</h4>}
            </div>
          </div>
          {user && user.isAdmin && user.isAdmin !== "false" && (
            <button onClick={openEdit} className="btn btn-primary">
              Edit Pet Info
            </button>
          )}
          {editOpened && <EditPet />}
        </>
      )}
    </>
  );
}

export default Pet;
