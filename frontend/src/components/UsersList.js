import React from "react";
import { connect } from "react-redux";

import {
  SET_USERS,
  ADD_NEW_USER,
  SET_USER_ONLINE,
  SET_USER_OFFLINE
} from "../redux/actionTypes";

import User from "./User";

class UsersList extends React.Component {
  state = {
    users: []
  };

  componentDidMount() {
    this.props.socket.emit(
      "getUsers",
      {
        jwt: this.props.jwt
      },
      users => {
        this.props.dispatch({ type: SET_USERS, users });
      }
    );
    this.props.socket.on("userCreated", user => {
      //this.setState({ users: [...this.state.users, user] });
      this.props.dispatch({ type: ADD_NEW_USER, username: user.username });
    });

    /*function flipOnline(user) {
      return function innerMap(currentUser) {
        if (currentUser.username === user.username)
          currentUser.online = !currentUser.online;
        return currentUser;
      };
    }*/

    this.props.socket.on("userConnect", user => {
      this.props.dispatch({ type: SET_USER_ONLINE, username: user.username });
      //this.setState({ users: this.state.users.map(flipOnline(user)) });
    });

    this.props.socket.on("userDisconnect", user => {
      this.props.dispatch({ type: SET_USER_OFFLINE, username: user.username });

      //this.setState({ users: this.state.users.map(flipOnline(user)) });
    });
  }

  render() {
    const onlineUsers = this.props.users.filter(user => user.online);
    const offlineUsers = this.props.users.filter(user => !user.online);
    return (
      <div className="online-people">
        {onlineUsers.map(user => (
          <User
            key={user.username}
            username={user.username}
            activeUser={user.activeUser}
            missedMessages={user.missedMessages}
            online={user.online}
          />
        ))}
        {offlineUsers.map(user => (
          <User
            key={user.username}
            username={user.username}
            activeUser={user.activeUser}
            missedMessages={user.missedMessages}
            online={user.online}
          />
        ))}
      </div>
    );
  }
}

const mapProps = ({ self, socket, users }) => ({
  jwt: self.jwt,
  username: self.username,
  socket: socket.socket,
  users
});

export default connect(mapProps)(UsersList);
