import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { SET_AUTHENTICATED, OPEN_SOCKET } from "../redux/actionTypes";

import "../styles/authentication.css";

class Registration extends React.Component {
  state = {
    username: "",
    password: "",
    passwordRepeat: "",
    errorMessage: "",
    image: null
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  imgChange = event => {
    const type = event.target.files[0].type;
    if (type.startsWith("image")) {
      this.setState({ image: event.target.files[0] });
    } else {
      this.setState({ errorMessage: "File must be an image" });
      setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 3000);
    }
  };

  registrationAttempt = event => {
    event.preventDefault();

    if (this.state.password !== this.state.passwordRepeat) {
      this.setState({ errorMessage: "passwords do not match" });
      setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("username", this.state.username);
    formData.append("password", this.state.password);
    formData.append("image", this.state.image);

    const uploadHeader = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios
      .post("/registerUser", formData, uploadHeader)
      .then(response => {
        localStorage.setItem("jwt", response.data.jwt);
        this.props.dispatch({ type: OPEN_SOCKET });
        this.props.dispatch({
          type: SET_AUTHENTICATED,
          jwt: response.data.jwt,
          username: this.state.username
        });
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
            type="password"
            name="passwordRepeat"
            onChange={this.onChange}
            placeholder="repeat password"
            value={this.state.passwordRepeat}
            className="authentication-inputText"
          />
          <button className="setProfile" type="button">
            <label htmlFor="image-upload" className="change-image">
              Profile Picture
            </label>
          </button>
          <input
            type="file"
            id="image-upload"
            onChange={this.imgChange}
            value=""
          />{" "}
          <input
            type="submit"
            onClick={this.registrationAttempt}
            value="Registration"
            className="authentication-inputSubmit"
            disabled={this.state.image === null}
          />
          <Link to="/login" className="link">
            Sign In
          </Link>
          <span className="errors">{this.state.errorMessage}</span>
        </form>
      </div>
    );
  }
}

export default connect()(Registration);
