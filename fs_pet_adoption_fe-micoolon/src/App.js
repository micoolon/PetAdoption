import "./App.css";
import HomeOut from "./Components/HomeOut";
import HomeIn from "./Components/HomeIn";
import Search from "./Components/Search";
import Admin from "./Components/Admin";
import Pet from "./Components/Pet";
import Profile from "./Components/Profile";
import Nav from "./Components/Nav";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppContext from "./context/AppContext";
import PrivateRoute from "./Components/PrivateRoute";
import AdminRoute from "./Components/AdminRoute";
import MyPets from "./Components/MyPets";

function App() {
  const userToSet = JSON.parse(localStorage.getItem("user")) || undefined;
  const [animalType, setAnimalType] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [user, setUser] = useState();
  const [petList, setPetList] = useState();
  const [chosenPet, setChosenPet] = useState(null);
  const [petToEdit, setPetToEdit] = useState();
  const [listChanged, setListChanged] = useState(1);
  const [redirectHome, setRedirectHome] = useState(false);

  useEffect(() => {
    if (userToSet) {
      setUser(userToSet);
    }
  }, []);
  return (
    <div className="App">
      <AppContext.Provider
        value={{
          animalType: animalType,
          setAnimalType: setAnimalType,
          errorMessage: errorMessage,
          setErrorMessage: setErrorMessage,
          user: user,
          setUser: setUser,
          petList: petList,
          setPetList: setPetList,
          chosenPet: chosenPet,
          setChosenPet: setChosenPet,
          petToEdit: petToEdit,
          setPetToEdit: setPetToEdit,
          listChanged: listChanged,
          setListChanged: setListChanged,
          redirectHome: redirectHome,
          setRedirectHome: setRedirectHome,
        }}
      >
        <Router>
          <Nav />
          <Switch>
            <Route path="/search" component={Search} />
            <Route exact path="/" component={HomeOut} />
            <Route path="/pet/:id" component={Pet} />
            <PrivateRoute exact path="/mypets" component={MyPets} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/members" component={HomeIn} />
            <AdminRoute exact path="/admin" component={Admin} />
          </Switch>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
