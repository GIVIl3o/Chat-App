import React from "react";
import { SET_SHOW_PASSWORD, SET_USER_MESSAGE } from "../redux/actionTypes";
import { connect } from "react-redux";

class ChangePassword extends React.Component {
  state = {
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: ""
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitChange = e => {
    e.preventDefault();

    if (this.state.newPassword !== this.state.newPasswordRepeat) {
      this.props.dispatch({
        type: SET_USER_MESSAGE,
        success: false,
        message: "Passwords don't match"
      });
      setTimeout(() => {
        this.props.dispatch({
          type: SET_USER_MESSAGE,
          success: false,
          message: ""
        });
      }, 3000);
      return;
    }

    this.props.socket.emit(
      "changePassword",
      {
        jwt: this.props.jwt,
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword
      },
      response => {
        this.setState({
          currentPassword: "",
          newPassword: "",
          newPasswordRepeat: ""
        });

        this.props.dispatch({ type: SET_USER_MESSAGE, ...response });

        setTimeout(() => {
          this.props.dispatch({
            type: SET_USER_MESSAGE,
            success: false,
            message: ""
          });
        }, 3000);
      }
    );
  };

  classNames = "animation-settings no-height"; // default classes
  render() {
    if (this.props.showPassword !== undefined)
      this.classNames =
        "animation-settings " +
        (this.props.showPassword ? "unfold-settings" : "fold-settings");

    return (
      <div className="changePassword">
        <button
          className="account-button"
          onClick={() => this.props.dispatch({ type: SET_SHOW_PASSWORD })}
        >
          Change Password
        </button>
        <div className={this.classNames}>
          <form>
            <input
              type="password"
              className="change-password"
              placeholder="Your Current Password"
              name="currentPassword"
              value={this.state.currentPassword}
              onChange={this.onChange}
            />
            <input
              type="password"
              className="change-password"
              placeholder="New Password"
              name="newPassword"
              value={this.state.newPassword}
              onChange={this.onChange}
            />
            <input
              type="password"
              className="change-password"
              placeholder="Repeat New Password"
              name="newPasswordRepeat"
              value={this.state.newPasswordRepeat}
              onChange={this.onChange}
            />
            <input
              type="submit"
              onClick={this.submitChange}
              value="Change Password"
              className="account-button smaller-centered"
            />
          </form>
        </div>
      </div>
    );
  }
}

const mapProps = ({ self, socket, UI }) => ({
  jwt: self.jwt,
  socket: socket.socket,
  showPassword: UI.showPassword
});

export default connect(mapProps)(ChangePassword);
