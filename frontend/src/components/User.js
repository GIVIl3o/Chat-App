import React from "react";
import { connect } from "react-redux";
import ProfileImage from "./ProfileImage";
import "../styles/messaging.css";
import { SET_ACTIVE_USER } from "../redux/actionTypes";

class User extends React.Component {
  setActive = () => {
    this.props.dispatch({
      type: SET_ACTIVE_USER,
      activeUser: this.props.username
    });
  };

  render() {
    const username = this.props.username;
    const online = this.props.online ? "Online" : "Offline";
    const classes = "user-active " + (this.props.online ? "user-online" : "");
    const userClasses =
      (this.props.missedMessages ? "missed-messages" : "") +
      (this.props.activeUser ? "activeUser" : "");

    return (
      <div className={`user ${userClasses}`} onClick={this.setActive}>
        <ProfileImage username={username} className="user-avatar" />
        <div className="user-information">
          <span className="user-username">{username}</span>
          <span className={classes}>{"" + online}</span>
        </div>
      </div>
    );
  }
}

export default connect()(User);
