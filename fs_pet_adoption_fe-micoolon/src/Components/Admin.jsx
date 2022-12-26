import React, { useState } from "react";
import AddPet from "./AddPet";
import UserDash from "./UserDash";
import PetDash from "./PetDash";

function Admin() {
  const [addOpen, setAddOpen] = useState(false);
  const [userDashOpen, setUserDashOpen] = useState(false);
  const [petDashOpen, setPetDashOpen] = useState(false);

  const openAddPet = () => {
    setUserDashOpen(false);
    setPetDashOpen(false);
    setAddOpen(true);
  };

  const openPetDashboard = () => {
    setAddOpen(false);
    setPetDashOpen(true);
    setUserDashOpen(false);
  };

  const openUserDashboard = () => {
    setAddOpen(false);
    setPetDashOpen(false);
    setUserDashOpen(true);
  };
  return (
    <>
      <div>
        <h1>Welcome to the Admin Page!</h1>
      </div>
      <div>
        <h2>Here you will be able to do admin stuff!</h2>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <button onClick={openAddPet} className="btn btn-primary">
            Add Pet
          </button>
        </div>
        <div>
          <button onClick={openPetDashboard} className="btn btn-primary">
            Pet Dashboard
          </button>
        </div>
        <div>
          <button onClick={openUserDashboard} className="btn btn-primary">
            User Dashboard
          </button>
        </div>
      </div>
      {addOpen && (
        <div className="addPetTop">
          <AddPet />
        </div>
      )}
      {petDashOpen && (
        <div>
          <PetDash />
        </div>
      )}
      {userDashOpen && (
        <div>
          <UserDash />
        </div>
      )}
    </>
  );
}

export default Admin;
