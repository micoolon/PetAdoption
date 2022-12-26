import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";

function Profile() {
  const appContext = useContext(AppContext);
  const [tempForm, setTempForm] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const user = appContext.user;
  const setUser = appContext.setUser;

  const handleChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setTempForm({ ...tempForm, [name]: value });
  };
  const handleSubmit = async () => {
    if (tempForm.email && !tempForm.email.includes("@")) {
      setErrorMessage("Email address must be valid");
      return;
    }
    setErrorMessage(undefined);
    const result = await axios
      .put(`http://localhost:4000/user/${user.id}`, tempForm, {
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
      setUser(result);
      setErrorMessage("User Updated Successfully");
    }
  };
  return (
    <>
      <h1>Hello {user.first_name}</h1>
      <div>Update Details</div>
      <form autoComplete="new-off">
        <input type="hidden" value="something" />
        <div className="inputContent">
          <input
            autoComplete="new-off"
            className="customInput"
            type="email"
            placeholder="Email"
            name="email"
            value={tempForm.email}
            onChange={handleChangeInput}
          />
        </div>
        <div className="inputContent">
          <input
            className="customInput"
            type="password"
            placeholder="Password"
            name="password"
            value={tempForm.password}
            onChange={handleChangeInput}
            autoComplete="off"
          />
        </div>
        <div className="inputContent">
          <input
            autoComplete="new-off"
            className="customInput"
            type="text"
            placeholder="First Name"
            name="fName"
            value={tempForm.fName}
            onChange={handleChangeInput}
          />
        </div>
        <div className="inputContent">
          <input
            autoComplete="new-off"
            className="customInput"
            type="text"
            placeholder="Last Name"
            name="lName"
            value={tempForm.lName}
            onChange={handleChangeInput}
          />
        </div>
        <div className="inputContent">
          <input
            className="numInput"
            type="number"
            placeholder="Phone Number"
            name="phone"
            value={tempForm.phone}
            onChange={handleChangeInput}
          />
        </div>
        <div className="inputContent">
          <input
            autoComplete="new-off"
            className="customInput"
            type="text"
            placeholder="Bio"
            name="bio"
            value={tempForm.bio}
            onChange={handleChangeInput}
          />
        </div>
      </form>
      <div>
        <button
          onClick={handleSubmit}
          className="btn btn-primary mt-2 mb-2"
          id="signupButton"
        >
          Update Details!
        </button>
      </div>
      <div className="errorMessage">{errorMessage}</div>
    </>
  );
}

export default Profile;
