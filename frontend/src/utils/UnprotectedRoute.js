import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

const UnprotectedRoute = ({ component, jwt, path }) => {
  if (jwt) {
    return <Route component={() => <Redirect to="/" />} exact path={path} />;
  } else {
    return <Route component={component} exact path={path} />;
  }
};

const mapState = state => ({
  jwt: state.self.jwt
});

export default connect(mapState)(UnprotectedRoute);
