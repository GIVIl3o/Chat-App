import React from "react";
import store from "./redux/store";
import { Provider } from "react-redux";
import Login from "./pages/Login";
import { Router } from "react-router-dom";
import Registration from "./pages/Registration";
import ChatPage from "./pages/ChatPage";
import { createBrowserHistory } from "history";

import ProtectedRoute from "./utils/ProtectedRoute";
import UnprotectedRoute from "./utils/UnprotectedRoute";

function App() {
  return (
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <UnprotectedRoute exact path="/login" component={Login} />
        <UnprotectedRoute exact path="/registration" component={Registration} />
        <ProtectedRoute exact path="/" component={ChatPage} />
      </Router>
    </Provider>
  );
}

export default App;
