import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { Redirect } from "react-router-dom";
import postToServer from "../lib/postToServer";

function Signup() {
  const appContext = useContext(AppContext);
  const [tempForm, setTempForm] = useState({});
  const [form, setForm] = useState();
  const [isFormIncomplete, setIsFormIncomplete] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [redirect, setRedirect] = useState(false);
  const setUser = appContext.setUser;

  const handleChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setTempForm({ ...tempForm, [name]: value });
  };

  useEffect(() => {
    if (
      tempForm.email &&
      tempForm.email.includes("@") &&
      tempForm.password &&
      tempForm.passwordConfirm &&
      tempForm.fName &&
      tempForm.lName &&
      tempForm.phone
    ) {
      setIsFormIncomplete(false);
    } else {
      setIsFormIncomplete(true);
    }
  }, [tempForm]);

  const logUser = async (user) => {
    setErrorMessage(undefined);
    const userToLog = {
      email: user.email,
      password: form.password,
    };
    const res = await postToServer("login", userToLog);
    if (res.token) {
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);
      setRedirect(true);
    } else if (!res.token) {
      setIsFormIncomplete(true);
      setErrorMessage(res.errMessage);
    }
  };

  const handleSubmit = () => {
    if (tempForm.password === tempForm.passwordConfirm) {
      setErrorMessage(undefined);
      setForm(tempForm);
    } else {
      setErrorMessage("Password does not Match");
    }
  };

  const addUser = async () => {
    setErrorMessage(undefined);
    const newUser = {
      email: form.email,
      password: form.password,
      fName: form.fName,
      lName: form.lName,
      phone: form.phone,
      isAdmin: false,
    };
    const res = await postToServer("signup", newUser);
    if (res.errMessage) {
      setIsFormIncomplete(true);
      setErrorMessage(res.errMessage);
    } else if (res[0].email) {
      logUser(res[0]);
    }
  };

  useEffect(() => {
    if (form) {
      addUser();
    }
  }, [form]);

  return (
    <>
      {redirect && <Redirect to="/members" />}
      <div>Signup</div>
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
            type="password"
            className="customInput"
            placeholder="Password"
            name="password"
            value={tempForm.password}
            onChange={handleChangeInput}
            autoComplete="off"
          />
        </div>
        <div className="inputContent">
          <input
            type="password"
            className="customInput"
            placeholder="Confirm Password"
            name="passwordConfirm"
            value={tempForm.passwordConfirm}
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
      </form>
      <div>
        <button
          disabled={isFormIncomplete}
          onClick={handleSubmit}
          className="btn btn-primary mt-2 mb-2"
          id="signupButton"
        >
          Sign Up!
        </button>
      </div>
      <div className="errorMessage">{errorMessage}</div>
    </>
  );
}

export default Signup;
