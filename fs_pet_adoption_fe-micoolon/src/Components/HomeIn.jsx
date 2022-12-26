import React, { useContext } from "react";
import AppContext from "../context/AppContext";

function HomeIn() {
  const appContext = useContext(AppContext);
  const user = appContext.user;
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <>
      <div className="mainPageHeader">
        <span className="siteTitle">Get-A-Pet</span>
        <span className="siteSubTitle">
          The Premire Place For Pet Adoption And Fostering
        </span>
      </div>
      <br />
      <div>
        <span style={{ color: "steelblue" }} className="siteSubTitle">
          Welcome {fullName}
        </span>
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

export default HomeIn;
