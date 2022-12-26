import React, { useContext, useEffect, useState } from "react";
import AdvancedSearch from "./AdvancedSearch";
import AppContext from "../context/AppContext";
import PetList from "./PetList";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

function Search() {
  const appContext = useContext(AppContext);
  const [searchTypeButton, setSearchTypeButton] = useState("Advanced Search");
  const animalType = appContext.animalType;
  const setAnimalType = appContext.setAnimalType;
  const setPetList = appContext.setPetList;
  const listChanged = appContext.listChanged;
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(useLocation().search)
  );
  const history = useHistory();

  useEffect(() => {
    setSearchTypeButton("Advanced Search");
    if (searchQuery.get("type") === "Dog") {
      setAnimalType("Dog");
    } else if (searchQuery.get("type") === "Cat") {
      setAnimalType("Cat");
    }
  }, []);

  useEffect(() => {
    if (listChanged && listChanged > 1) {
      handleSearch();
    }
  }, [listChanged]);

  const searchChange = () => {
    if (searchTypeButton === "Advanced Search") {
      setSearchTypeButton("Basic Search");
    } else {
      setSearchTypeButton("Advanced Search");
    }
  };

  const handleAnimalType = (e) => {
    setAnimalType(e.target.value);
  };

  const handleSearch = async () => {
    history.push({
      pathname: "/search",
      search:
        "?" +
        new URLSearchParams({
          type: animalType,
        }).toString(),
    });
    axios
      .get(`http://localhost:4000/pet/`, {
        params: {
          pet_type: animalType,
        },
      })
      .then((response) => {
        setPetList(response.data);
      });
  };

  return (
    <div>
      <h1>Find A New Friend</h1>
      <br />
      <p onClick={searchChange} className="searchTypeButton">
        {searchTypeButton}
      </p>
      {searchTypeButton === "Advanced Search" && (
        <>
          <div className="searchContainer">
            <div className="searchForm">
              <div>
                <select
                  className="customInput"
                  onChange={handleAnimalType}
                  value={animalType}
                >
                  <option selected="" className="custom-select">
                    Animal
                  </option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>
              <div>
                <button onClick={handleSearch} className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
          <PetList />
        </>
      )}
      {searchTypeButton === "Basic Search" && <AdvancedSearch />}
    </div>
  );
}

export default Search;
