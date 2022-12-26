import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AppContext from "../context/AppContext";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const appContext = useContext(AppContext);

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (!appContext.user) {
          return <Redirect to={"/"} />;
        } else {
          return <RouteComponent {...routeProps} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
