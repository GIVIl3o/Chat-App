import { createStore } from "redux";
import { combineReducers } from "redux";
import jwtDecode from "jwt-decode";

import self from "./reducers/selfReducer";
import socket from "./reducers/socketReducer";
import UI from "./reducers/UIReducer";
import users from "./reducers/usersReducer";

import { OPEN_SOCKET, SET_AUTHENTICATED } from "./actionTypes";

const reducers = combineReducers({
  self,
  socket,
  UI,
  users
});

const store = createStore(reducers);

try {
  const decoded = jwtDecode(localStorage.getItem("jwt"));
  if (decoded.exp * 1000 > Date.now()) {
    store.dispatch({
      type: SET_AUTHENTICATED,
      jwt: localStorage.getItem("jwt"),
      username: decoded.username
    });
    store.dispatch({ type: OPEN_SOCKET });
  }
} catch (e) {}

export default store;
