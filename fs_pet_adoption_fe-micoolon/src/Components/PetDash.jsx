import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import AppContext from "../context/AppContext";
import axios from "axios";

function PetDash() {
  const appContext = useContext(AppContext);
  const user = appContext.user;
  const [pets, setPets] = useState();

  useEffect(() => {
    getAllPets();
  }, []);

  const getAllPets = async () => {
    axios
      .get(`http://localhost:4000/pet/all`, {
        headers: {
          Authorization: "Bearer " + user.token,
          id: user.id,
        },
      })
      .then((response) => {
        setPets(response.data);
      });
  };

  return (
    <div className="list">
      {pets && (
        <>
          {pets.map((petItem) => {
            return (
              <>
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
              </>
            );
          })}
        </>
      )}
    </div>
  );
}

export default PetDash;
