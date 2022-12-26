import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { Redirect } from "react-router-dom";
import postToServer from "../lib/postToServer";

function Login() {
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
    if (tempForm.email && tempForm.password) {
      setIsFormIncomplete(false);
    } else {
      setIsFormIncomplete(true);
    }
  }, [tempForm]);

  const handleSubmit = () => {
    setForm(tempForm);
  };

  const logUser = async () => {
    setErrorMessage(undefined);
    const userToLog = {
      email: form.email,
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

  useEffect(() => {
    if (form) {
      logUser();
    }
  }, [form]);

  return (
    <>
      {redirect && <Redirect to="/members" />}
      <div>Login</div>
      <form autoComplete="off">
        <input type="hidden" value="something" />
        <div className="inputContent">
          <input
            autoComplete="off"
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
            autoComplete="off"
            className="customInput"
            type="password"
            placeholder="Password"
            name="password"
            value={tempForm.password}
            onChange={handleChangeInput}
          />
        </div>
      </form>
      <div>
        <button
          disabled={isFormIncomplete}
          onClick={handleSubmit}
          className="btn btn-primary mt-2 mb-2"
          id="loginButton"
        >
          Log in!
        </button>
      </div>
      <div className="errorMessage">{errorMessage}</div>
    </>
  );
}

export default Login;
