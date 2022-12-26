import React, { useContext, useEffect, useState } from "react";
import catBreeds from "../Databases/CatBreeds";
import dogBreeds from "../Databases/DogBreeds";
import AppContext from "../context/AppContext";
import PetList from "./PetList";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

function AdvancedSearch() {
  const [animalTempForm, setAnimalTempForm] = useState({});
  const appContext = useContext(AppContext);
  const animalType = appContext.animalType;
  const setAnimalType = appContext.setAnimalType;
  const setPetList = appContext.setPetList;
  const listChanged = appContext.listChanged;

  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(useLocation().search)
  );
  const history = useHistory();

  useEffect(() => {
    setPetList(undefined);
    if (searchQuery.get("type") === "Dog") {
      setAnimalTempForm({ ...animalTempForm, animalType: "Dog" });
    } else if (searchQuery.get("type") === "Cat") {
      setAnimalTempForm({ ...animalTempForm, animalType: "Cat" });
    }

    const nameQuery = searchQuery.get("name");
    setAnimalTempForm({ ...animalTempForm, animalName: nameQuery });

    const statusQuery = searchQuery.get("status");
    setAnimalTempForm({ ...animalTempForm, adoptionStatus: statusQuery });

    const minHeightQuery = searchQuery.get("minheight");
    setAnimalTempForm({ ...animalTempForm, minHeight: minHeightQuery });

    const maxHeightQuery = searchQuery.get("maxheight");
    setAnimalTempForm({ ...animalTempForm, maxHeight: maxHeightQuery });

    const minWeightQuery = searchQuery.get("minweight");
    setAnimalTempForm({ ...animalTempForm, minWeight: minWeightQuery });

    const maxWeightQuery = searchQuery.get("maxweight");
    setAnimalTempForm({ ...animalTempForm, maxWeight: maxWeightQuery });

    const breedQuery = searchQuery.get("breed");
    setAnimalTempForm({ ...animalTempForm, breed: breedQuery });
  }, []);

  useEffect(() => {
    if (listChanged && listChanged > 1) {
      handleSearch();
    }
  }, [listChanged]);

  const handleAnimalType = (e) => {
    setAnimalType(e.target.value);
  };

  const handleChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAnimalTempForm({ ...animalTempForm, [name]: value });
  };

  const handleSearch = async () => {
    history.push({
      pathname: "/search",
      search:
        "?" +
        new URLSearchParams({
          type: animalType,
          name: animalTempForm.animalName,
          status: animalTempForm.adoptionStatus,
          minheight: animalTempForm.minHeight,
          maxheight: animalTempForm.maxHeight,
          minweight: animalTempForm.minWeight,
          maxweight: animalTempForm.maxWeight,
          breed: animalTempForm.breed,
        }).toString(),
    });
    axios
      .get(`http://localhost:4000/pet/`, {
        params: {
          pet_type: animalType,
          pet_name: animalTempForm.animalName,
          pet_status: animalTempForm.adoptionStatus,
          pet_minheight: animalTempForm.minHeight,
          pet_maxheight: animalTempForm.maxHeight,
          pet_minweight: animalTempForm.minWeight,
          pet_maxweight: animalTempForm.maxWeight,
          pet_breed: animalTempForm.breed,
        },
      })
      .then((response) => {
        setPetList(response.data);
      });
  };

  return (
    <div className="searchContainer">
      <div className="testForm">
        <div>
          <select
            onChange={handleAnimalType}
            value={animalType}
            className="customInput"
          >
            <option selected="" class="custom-select">
              Animal
            </option>
            <option value="Cat">Cat</option>
            <option value="Dog">Dog</option>
          </select>
        </div>
        <div>
          <select
            name="breed"
            value={animalTempForm.breed}
            onChange={handleChangeInput}
            className="customInput"
          >
            <option selected="" class="custom-select">
              Breed
            </option>
            {animalType === "Cat" && (
              <>
                {catBreeds.map((breed) => {
                  return <option value={breed}>{breed}</option>;
                })}
              </>
            )}
            {animalType === "Dog" && (
              <>
                {dogBreeds.map((breed) => {
                  return <option value={breed.name}>{breed.name}</option>;
                })}
              </>
            )}
          </select>
        </div>
        <div>
          <select
            name="adoptionStatus"
            value={animalTempForm.adoptionStatus}
            onChange={handleChangeInput}
            className="customInput"
          >
            <option>Adoption Status</option>
            <option value="Foster">Foster</option>
            <option value="Adopt">Adopt</option>
          </select>
        </div>
        <div>
          <input
            className="customInput"
            type="number"
            placeholder="Min Height In CM"
            name="minHeight"
            value={animalTempForm.minHeight}
            onChange={handleChangeInput}
          />
          <input
            className="customInput"
            type="number"
            placeholder="Max Height In CM"
            name="maxHeight"
            value={animalTempForm.maxHeight}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <input
            className="customInput"
            type="number"
            placeholder="Min Weight In Kg"
            name="minWeight"
            value={animalTempForm.minWeight}
            onChange={handleChangeInput}
          />
          <input
            className="customInput"
            type="number"
            placeholder="Max Weight In Kg"
            name="maxWeight"
            value={animalTempForm.maxWeight}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <input
            className="customInput"
            type="text"
            placeholder="Name"
            name="animalName"
            value={animalTempForm.animalName}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <button
            onClick={handleSearch}
            className="btn btn-primary"
            style={{ marginBottom: "5px" }}
          >
            Search
          </button>
        </div>
      </div>
      <PetList />
    </div>
  );
}

export default AdvancedSearch;
