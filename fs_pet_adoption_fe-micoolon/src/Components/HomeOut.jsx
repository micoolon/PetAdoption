import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import AppContext from "../context/AppContext";

function HomeOut() {
  const appContext = useContext(AppContext);
  const [redirect, setRedirect] = useState(false);

  const user = appContext.user;

  useEffect(() => {
    if (user) {
      setRedirect(true);
    } else if (!user) {
      setRedirect(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setRedirect(true);
    } else if (!user) {
      setRedirect(false);
    }
  }, [user]);

  return (
    <>
      {redirect && <Redirect to="/members" />}
      <div className="mainPageHeader">
        <span className="siteTitle">Get-A-Pet</span>
        <span className="siteSubTitle">
          The Premire Place For Pet Adoption And Fostering
        </span>
      </div>
      <div>
        <br />
        <h4>
          There are a lot of animals who need forever homes, and this is your
          chance to give it to them.
        </h4>
        <h4>
          Browse through a large selection of animals to find the one that is
          right for you!
        </h4>
      </div>
    </>
  );
}

export default HomeOut;
