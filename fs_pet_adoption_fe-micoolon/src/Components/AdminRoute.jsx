import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AppContext from "../context/AppContext";

const AdminRoute = ({ component: RouteComponent, ...rest }) => {
  const appContext = useContext(AppContext);

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (!appContext.user) {
          return <Redirect to={"/"} />;
        } else if (
          appContext.user.isAdmin === "false" ||
          !appContext.user.isAdmin
        ) {
          return <Redirect to={"/"} />;
        } else {
          return <RouteComponent {...routeProps} />;
        }
      }}
    />
  );
};

export default AdminRoute;
