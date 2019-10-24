import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { SET_AUTHENTICATED, OPEN_SOCKET } from "../redux/actionTypes";
import { connect } from "react-redux";

import "../styles/authentication.css";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    errorMessage: ""
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  loginAttempt = async event => {
    event.preventDefault();
    axios
      .post("/verifyUser", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        localStorage.setItem("jwt", response.data.jwt);
        this.props.dispatch({ type: OPEN_SOCKET });
        this.props.dispatch({
          type: SET_AUTHENTICATED,
          jwt: response.data.jwt,
          username: this.state.username
        });
        this.props.history.push("/");
      })
      .catch(error => {
        const errorMessage = error.response.data;
        this.setState(errorMessage);

        setTimeout(() => {
          this.setState({ errorMessage: "" });
        }, 3000);
      });
  };

  render() {
    return (
      <div className="authentication">
        <form>
          <input
            type="text"
            name="username"
            onChange={this.onChange}
            placeholder="username"
            value={this.state.username}
            className="authentication-inputText"
            autoFocus
          />
          <input
            type="password"
            name="password"
            onChange={this.onChange}
            placeholder="password"
            value={this.state.password}
            className="authentication-inputText"
          />
          <input
            type="submit"
            onClick={this.loginAttempt}
            value="Login"
            className="authentication-inputSubmit"
          />
          <Link to="/registration" className="link">
            Sign Up
          </Link>
          <span className="errors">{this.state.errorMessage}</span>
        </form>
      </div>
    );
  }
}

const mapState = ({ self }) => ({
  loading: self.loading
});

export default connect(mapState)(Login);
