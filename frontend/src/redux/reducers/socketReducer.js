import openSocket from "socket.io-client";

import { OPEN_SOCKET, CLOSE_SOCKET } from "../actionTypes";

const defaultState = {
  socket: null
};

function socketReducer(state = defaultState, action) {
  switch (action.type) {
    case OPEN_SOCKET:
      return {
        socket: openSocket("ws://localhost:3001", {
          query: { jwt: localStorage.getItem("jwt") }
        })
      };
    case CLOSE_SOCKET:
      state.socket.close();
      return state;
    default:
      return state;
  }
}

export default socketReducer;
