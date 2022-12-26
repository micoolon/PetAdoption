import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import catBreeds from "../Databases/CatBreeds";
import dogBreeds from "../Databases/DogBreeds";
import axios from "axios";

function AddPet() {
  const [animalTempForm, setAnimalTempForm] = useState({});
  const [finalForm, setFinalForm] = useState();
  const [isFormIncomplete, setIsFormIncomplete] = useState(true);
  const [isHypo, setIsHypo] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [petImage, setPetImage] = useState();

  const appContext = useContext(AppContext);
  const user = appContext.user;

  const handleChangeHypo = (e) => {
    setIsHypo(e.target.checked);
  };

  function handleImage(e) {
    if (!e.target.files[0]) return;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setPetImage(reader.result);
    };
    reader.onerror = () => {};
  }

  const handleChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAnimalTempForm({
      ...animalTempForm,
      [name]: value,
      imageUrl: petImage,
      adoptionStatus: "Available",
      ownerEmail: "",
      isHypo: isHypo,
    });
  };

  const addNewPet = async () => {
    const res = await axios.post(`http://localhost:4000/pet`, finalForm, {
      headers: {
        Authorization: "Bearer " + user.token,
        id: user.id,
      },
    });
    if (res.data && res.data === "success") {
      setErrorMessage("Pet Added Successfully!");
      setIsFormIncomplete(true);
    } else {
      setIsFormIncomplete(true);
      setErrorMessage(res.errMessage);
    }
  };

  useEffect(() => {
    if (
      animalTempForm.animalType !== "Animal" &&
      animalTempForm.breed &&
      animalTempForm.breed !== "Breed" &&
      animalTempForm.height &&
      animalTempForm.weight &&
      animalTempForm.animalName &&
      animalTempForm.imageUrl
    ) {
      setIsFormIncomplete(false);
    } else {
      setIsFormIncomplete(true);
    }
  }, [animalTempForm]);

  useEffect(() => {
    if (finalForm) {
      addNewPet();
    }
  }, [finalForm]);

  const handleSubmit = () => {
    setFinalForm(animalTempForm);
  };

  return (
    <>
      <div>
        <h2>Add New Pet!</h2>
      </div>
      <div className="addPetContainer">
        <div>
          <select
            name="animalType"
            onChange={handleChangeInput}
            value={animalTempForm.animalType}
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
            {animalTempForm.animalType === "Cat" && (
              <>
                {catBreeds.map((breed) => {
                  return <option value={breed}>{breed}</option>;
                })}
              </>
            )}
            {animalTempForm.animalType === "Dog" && (
              <>
                {dogBreeds.map((breed) => {
                  return <option value={breed.name}>{breed.name}</option>;
                })}
              </>
            )}
          </select>
        </div>

        <div>
          <input
            type="number"
            className="numInput"
            placeholder="Height In CM"
            name="height"
            value={animalTempForm.height}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <input
            type="number"
            className="numInput"
            placeholder="Weight In Kg"
            name="weight"
            value={animalTempForm.weight}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <input
            type="text"
            className="customInput"
            placeholder="Name"
            name="animalName"
            value={animalTempForm.animalName}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          {/* <input
            type="text"
            className="customInput"
            placeholder="Image URL"
            name="imageUrl"
            value={animalTempForm.imageUrl}
            onChange={handleChangeInput}
          /> */}
          <input
            className="customInput"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImage}
          />
        </div>
        <div>
          <h3>Optional</h3>
        </div>
        <div>
          <p>Hypoallergenic</p>
          <input
            type="checkbox"
            className="customInput"
            id="isHypo"
            name="isHypo"
            onChange={handleChangeHypo}
          />
        </div>
        <div>
          <textarea
            style={{ resize: "none" }}
            type="text"
            className="customInput"
            placeholder="Pet Bio...."
            name="bio"
            value={animalTempForm.bio}
            onChange={handleChangeInput}
            maxLength="140"
          />
        </div>
        <div>
          <input
            type="text"
            className="customInput"
            placeholder="Color"
            name="color"
            value={animalTempForm.color}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <input
            type="text"
            className="customInput"
            placeholder="Dietary Restrictions"
            name="diet"
            value={animalTempForm.diet}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <button
            disabled={isFormIncomplete}
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="errorMessage">{errorMessage}</div>
    </>
  );
}

export default AddPet;
