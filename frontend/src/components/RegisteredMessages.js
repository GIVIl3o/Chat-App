import React from "react";
import { connect } from "react-redux";
import { NEW_MISSED_MESSAGE } from "../redux/actionTypes";

class RegisteredMessages extends React.Component {
  state = {
    messages: [],
    viewMore: true,
  }

  receiveMessage = (msg) => {
    const activeUser = this.props.activeUser;
    if (activeUser === msg.from || activeUser === msg.to)
      this.setState({ messages: [...this.state.messages, msg] });
    else {
      this.props.dispatch({ type: NEW_MISSED_MESSAGE, msg });
    }
  }

  getMessages = (currentMessages) => {
    this.props.socket.emit(
      "getMessages",
      {
        jwt: this.props.jwt,
        sender: this.props.activeUser,
        offset: currentMessages.length,
        count: 10
      },
      messages => {
        messages.reverse();
        const viewMore = messages.length >= 10;
        this.setState({ messages: [...messages, ...currentMessages], viewMore });
      }
    );
  }

  componentDidMount() {
    this.getMessages(this.state.messages);
    this.props.socket.on("receiveMessage", this.receiveMessage);
  }

  componentWillUnmount() {
    this.props.socket.removeListener("receivedMessage", this.receiveMessage);
  }


  componentDidUpdate(prevProps) {
    if (prevProps.activeUser !== this.props.activeUser) {
      this.getMessages([]);
    }

    this.chatEnd.scrollIntoView();
  }

  moreMessages = () => {
    this.getMessages(this.state.messages);
  }

  render() {
    const renderMessage = (message) => {
      const myMessage = message.from !== this.props.activeUser ? "send-message" : "received-message";
      return (
        <div className={`message ${myMessage}`} key={message.id}>
          <span>{message.message}</span>
        </div>
      );
    }
    const viewMore = this.state.viewMore ?
      <span className="more-messages" onClick={this.moreMessages}>View More</span> :
      "";

    return (
      <div className="registered-messages">
        {viewMore}
        {this.state.messages.map(renderMessage)}
        <div ref={(ref) => this.chatEnd = ref} />
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

export default connect(mapProps)(RegisteredMessages);
