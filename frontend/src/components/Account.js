import React from "react";
import { connect } from "react-redux";
import {
  SET_AUTHENTICATED,
  CLOSE_SOCKET,
  SET_SHOW_ACCOUNT
} from "../redux/actionTypes";
import ChangePicture from "./ChangePicture";
import ProfileImage from "./ProfileImage";
import ChangePassword from "./ChangePassword";
import "../styles/account.css";

class Account extends React.Component {
  logout = () => {
    localStorage.removeItem("jwt");
    this.props.dispatch({ type: CLOSE_SOCKET });
    this.props.dispatch({ type: SET_AUTHENTICATED, jwt: "", username: "" });
  };

  classNames = "animation-settings no-height";

  render() {
    if (this.props.showAccount !== undefined)
      this.classNames =
        "animation-settings " +
        (this.props.showAccount ? "unfold-settings" : "fold-settings");

    const userMessageClasses =
      "user-message " + (this.props.messageSuccess ? "message-success" : "");

    return (
      <div className="account">
        <div
          className="account-settings"
          onClick={() => this.props.dispatch({ type: SET_SHOW_ACCOUNT })}
        >
          <ProfileImage
            username={this.props.username}
            className="profile-picture"
          />
          <span className="profile-text">Profile</span>
        </div>

        <div className={this.classNames}>
          <ChangePassword />
          <ChangePicture />
          <button className="account-button" onClick={this.logout}>
            Logout
          </button>

          <span className={userMessageClasses}>{this.props.userMessage}</span>
        </div>
      </div>
    );
  }
}

const mapProps = ({ self, socket, UI }) => ({
  username: self.username,
  socket: socket.socket,
  showAccount: UI.showAccount,
  messageSuccess: UI.messageSuccess,
  userMessage: UI.userMessage
});

export default connect(mapProps)(Account);
