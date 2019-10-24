import React from "react";
import { connect } from "react-redux";
import Account from "../components/Account";
import Messaging from "../components/Messaging";
import { CLOSE_SOCKET, SET_AUTHENTICATED } from "../redux/actionTypes";

import "../styles/account.css";

class ChatPage extends React.Component {
  jwtExpiredListener = () => {
    localStorage.removeItem("jwt");
    this.props.dispatch({ type: CLOSE_SOCKET });
    this.props.dispatch({ type: SET_AUTHENTICATED, jwt: "", username: "" });
  };

  componentDidMount() {
    this.props.socket.on("jwtExpired", this.jwtExpiredListener);
  }

  componentWillUnmount() {
    this.props.socket.removeListener("jwtExpired", this.jwtExpiredListener);
  }

  render() {
    return (
      <div className="chat-container">
        <Messaging />
        <Account />
      </div>
    );
  }
}

const mapProps = ({ socket }) => ({
  socket: socket.socket
});

export default connect(mapProps)(ChatPage);
