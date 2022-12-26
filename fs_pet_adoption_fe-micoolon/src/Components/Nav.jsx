import React, { useContext, useState } from "react";
import Modal from "react-modal";
import Signup from "./Signup";
import Login from "./Login";
import { Link } from "react-router-dom";
import "../App.css";
import AppContext from "../context/AppContext";

function Nav() {
  const appContext = useContext(AppContext);
  const [modalIsOpen, setIsOpen] = useState(false);

  function changeModal() {
    setIsOpen(!modalIsOpen);
  }

  function afterOpenModal() {}

  const logOut = () => {
    localStorage.removeItem("user");
    appContext.setUser("");
  };
  return (
    <div className="navbar">
      {/* logged in ADMIN */}
      {appContext.user && appContext.user.isAdmin === "true" && (
        <>
          <Link className="navItem" to="/">
            Home
          </Link>
          <Link className="navItem" to="/Search">
            Search
          </Link>
          <Link className="navItem" to="/Admin">
            Admin
          </Link>
          <Link className="navItem" to="/Profile">
            Profile
          </Link>
          <Link className="navItem" to="/Mypets">
            My Pets
          </Link>
          <div className="logoutButton" onClick={logOut}>
            Logout
          </div>
        </>
      )}
      {/* logged in NOT ADMIN */}
      {appContext.user &&
        (appContext.user.isAdmin === "false" || !appContext.user.isAdmin) && (
          <>
            <Link className="navItem" to="/">
              Home
            </Link>
            <Link className="navItem" to="/Search">
              Search
            </Link>
            <Link className="navItem" to="/Profile">
              Profile
            </Link>
            <Link className="navItem" to="/Mypets">
              My Pets
            </Link>
            <div className="logoutButton" onClick={logOut}>
              Logout
            </div>
          </>
        )}
      {/* logged out */}
      {!appContext.user && (
        <>
          <Link className="navItem" to="/">
            Home
          </Link>
          <Link className="navItem" to="/Search">
            Search
          </Link>

          <div className="logoutButton" onClick={changeModal}>
            Log in/Sign up
          </div>

          <div className="modalContainer">
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={changeModal}
              className="modalCard"
            >
              <div className="logCloser" onClick={changeModal}>
                &#10006;
              </div>
              <div id="modalContent" className="logModule">
                <div className="modalHalf">
                  <Login />
                </div>
                <div className="vl"></div>
                <div className="modalHalf">
                  <Signup />
                </div>
              </div>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}

export default Nav;
