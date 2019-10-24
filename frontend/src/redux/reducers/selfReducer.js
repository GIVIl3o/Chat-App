import { SET_AUTHENTICATED } from "../actionTypes";

const defaultUserState = {
  jwt: "",
  username: ""
};

function selfReducers(state = defaultUserState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        loading: state.loading,
        jwt: action.jwt,
        username: action.username
      };
    default:
      return state;
  }
}

export default selfReducers;
