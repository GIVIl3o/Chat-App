import React from "react";
import UsersList from "./UsersList";
import ChatArea from "./ChatArea";

class Messaging extends React.Component {
  render() {
    return (
      <div className="messaging">
        <UsersList />
        <ChatArea />
      </div>
    );
  }
}

export default Messaging;
