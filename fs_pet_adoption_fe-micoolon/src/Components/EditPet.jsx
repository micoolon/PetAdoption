import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";
import catBreeds from "../Databases/CatBreeds";
import dogBreeds from "../Databases/DogBreeds";

function EditPet() {
  const appContext = useContext(AppContext);
  const petToEdit = appContext.petToEdit;
  const user = appContext.user;
  const [animalTempForm, setAnimalTempForm] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [isHypo, setIsHypo] = useState();
  const [petImage, setPetImage] = useState();

  const handleChangeHypo = (e) => {
    setIsHypo(e.target.checked);
  };

  const handleChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAnimalTempForm({
      ...animalTempForm,
      [name]: value,
      imageUrl: petImage,
      isHypo: isHypo,
    });
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

  const handleSubmit = async () => {
    setErrorMessage(undefined);
    const result = await axios
      .put(`http://localhost:4000/pet/${petToEdit.id}`, animalTempForm, {
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
      setErrorMessage("Pet Updated Successfully");
    }
  };
  return (
    <>
      <div>
        <select
          className="customInput"
          name="breed"
          value={animalTempForm.breed}
          onChange={handleChangeInput}
        >
          <option selected="" class="custom-select">
            Breed
          </option>
          {petToEdit.animalType === "Cat" && (
            <>
              {catBreeds.map((breed) => {
                return <option value={breed}>{breed}</option>;
              })}
            </>
          )}
          {petToEdit.animalType === "Dog" && (
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
          className="customInput"
          type="text"
          placeholder="Name"
          name="animalName"
          value={animalTempForm.animalName}
          onChange={handleChangeInput}
        />
      </div>
      <div>
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
          className="customInput"
          type="checkbox"
          id="isHypo"
          name="isHypo"
          onChange={handleChangeHypo}
        />
      </div>
      <div>
        <textarea
          className="customInput"
          style={{ resize: "none" }}
          type="text"
          placeholder="Pet Bio...."
          name="bio"
          value={animalTempForm.bio}
          onChange={handleChangeInput}
          maxLength="140"
        />
      </div>
      <div>
        <input
          className="customInput"
          type="text"
          placeholder="Color"
          name="color"
          value={animalTempForm.color}
          onChange={handleChangeInput}
        />
      </div>
      <div>
        <input
          className="customInput"
          type="text"
          placeholder="Dietary Restrictions"
          name="diet"
          value={animalTempForm.diet}
          onChange={handleChangeInput}
        />
      </div>
      <div>
        <button onClick={handleSubmit} className="btn btn-primary">
          Save Changes
        </button>
      </div>
      <div className="errorMessage">{errorMessage}</div>
    </>
  );
}

export default EditPet;
