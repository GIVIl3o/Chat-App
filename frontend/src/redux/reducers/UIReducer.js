import {
  SET_SHOW_ACCOUNT,
  SET_SHOW_PASSWORD,
  SET_USER_MESSAGE
} from "../actionTypes";

const defaultState = {
  showAccount: undefined,
  showPassword: undefined,
  messageSuccess: false,
  userMessage: ""
};

function UIReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_SHOW_ACCOUNT:
      return Object.assign({}, state, { showAccount: !state.showAccount });
    case SET_SHOW_PASSWORD:
      return Object.assign({}, state, { showPassword: !state.showPassword });
    case SET_USER_MESSAGE:
      return Object.assign({}, state, {
        messageSuccess: action.success,
        userMessage: action.message
      });
    default:
      return state;
  }
}

export default UIReducer;
