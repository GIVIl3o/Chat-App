import React from "react";
import RegisteredMessages from "./RegisteredMessages";
import { connect } from "react-redux";
import AutoSizeTextArea from 'react-textarea-autosize';

class ChatArea extends React.Component {
  state = {
    toSendMessage: "",
  }

  sendMessage = () => {
    this.props.socket.emit("onMessage", {
      jwt: this.props.jwt,
      to: this.props.activeUser,
      message: this.state.toSendMessage
    })
    this.setState({ toSendMessage: "" });
  }

  onKeyDown = (e) => {
    if (!e.shiftKey && e.key === "Enter") {
      if (this.state.toSendMessage !== "")
        this.sendMessage();
      e.preventDefault();
    }
  }

  render() {
    return (
      <div className="chat" >
        <RegisteredMessages />
        <AutoSizeTextArea
          maxRows={3}
          onChange={e => this.setState({ toSendMessage: e.target.value })}
          className="input-message"
          value={this.state.toSendMessage}
          onKeyDown={this.onKeyDown}
          autoFocus
        />
      </div>
    );
  }
}

const mapProps = ({ self, users, socket }) => {
  let activeUser = users.find(user => user.activeUser);
  activeUser = (activeUser || { username: "alex" }).username;

  return {
    jwt: self.jwt,
    socket: socket.socket,
    activeUser
  };
};

export default connect(mapProps)(ChatArea);
