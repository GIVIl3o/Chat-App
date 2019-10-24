import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

const ProtectedRoute = ({ component, jwt }) => {
  if (jwt) {
    return <Route exact path="/" component={component} />;
  } else {
    return <Route exact path="/" component={() => <Redirect to="/login" />} />;
  }
};

const mapState = state => ({
  jwt: state.self.jwt
});

export default connect(mapState)(ProtectedRoute);
