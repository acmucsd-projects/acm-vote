import React, {useState} from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreatePoll from "./pages/CreatePoll";
import Vote from "./pages/Vote";
import MyPolls from "./pages/MyPolls";
import storage, {history} from "./storage";
import "./App.css";
import {Router} from "react-router";
import {Route, Redirect} from "react-router-dom";

/**
 * Helper function to get token claims.
 * Credits to ACM @ UCLA for this function.
 *
 * @param {string} token - A jwt token returned from auth.
 * @return {object} The claims from the token.
 */
const tokenGetClaims = (token) => {
  if (!token) {
    return {};
  }
  const tokenArray = token.split(".");
  if (tokenArray.length !== 3) {
    return {};
  }
  return JSON.parse(
    window.atob(tokenArray[1].replace("-", "+").replace("_", "/"))
  );
};

const loggedIn = (Component) => (props) => {
  const authenticated =
    storage.get("token") !== "" &&
    tokenGetClaims(storage.get("token")).exp >
      Math.floor(new Date().getTime() / 1000);
  return authenticated ? <Component /> : <Redirect to="/login" />;
};

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={loggedIn(Home)} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/create" component={loggedIn(CreatePoll)} />
      <Route exact path="/election/:uuid" component={loggedIn(Vote)} />
      <Route exact path="/my-polls" component={loggedIn(MyPolls)} />
    </div>
  );
}

export default App;
