import {
  SET_USERS,
  SET_ACTIVE_USER,
  NEW_MISSED_MESSAGE,
  ADD_NEW_USER,
  SET_USER_ONLINE,
  SET_USER_OFFLINE
} from "../actionTypes";

const defaultUserState = [];

// user = {username,activeUser,missedMessages,online}

function usersReducers(state = defaultUserState, action) {
  let newState;
  let user;
  switch (action.type) {
    case SET_USERS:
      newState = action.users.map(user =>
        Object.assign({}, user, { activeUser: false, missedMessages: false })
      );
      if (newState.length) newState[0].activeUser = true;
      return newState;
    case SET_ACTIVE_USER:
      newState = [...state];
      newState.find(user => user.activeUser).activeUser = false;
      user = newState.find(user => user.username === action.activeUser);
      user.activeUser = true;
      user.missedMessages = false;
      return newState;
    case NEW_MISSED_MESSAGE:
      newState = [...state];
      user = newState.find(user => user.username === action.msg.from);
      user.missedMessages = true;
      return newState;
    case ADD_NEW_USER:
      return [
        ...state,
        {
          username: action.username,
          activeUser: false,
          missedMessages: false,
          online: false
        }
      ];
    case SET_USER_ONLINE:
      newState = [...state];
      user = newState.find(user => user.username === action.username);
      if (user) user.online = true;
      return newState;
    case SET_USER_OFFLINE:
      newState = [...state];
      user = newState.find(user => user.username === action.username);
      if (user) user.online = false;
      return newState;
    default:
      return state;
  }
}

export default usersReducers;
