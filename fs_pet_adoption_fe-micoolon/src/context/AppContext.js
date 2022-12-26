import React from "react";

const AppContext = React.createContext({
  animalType: "",
  setAnimalType: "",
  errorMessage: "",
  setErrorMessage: "",
  user: "",
  setUser: "",
  petList: "",
  setPetList: "",
  chosenPet: "",
  setChosenPet: "",
  petToEdit: "",
  setPetToEdit: "",
  listChanged: "",
  setListChanged: "",
  redirectHome: "",
  setRedirectHome: "",
});

export default AppContext;
