import React, { useEffect, useMemo } from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";

type Props = RouteProps;

const SafeRoute = (props: Props) => {
  const isLoggedIn = useMemo(() => {
    return !!window.localStorage.getItem("token");
  }, []);

  return isLoggedIn ? <Route {...props} /> : <Navigate to="/login" />;
};

export default SafeRoute;
