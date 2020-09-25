import React from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreatePoll from './pages/CreatePoll';
import Vote from './pages/Vote';
import MyPolls from './pages/MyPolls'
import './App.css';
import {Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/create" component={CreatePoll} />
      <Route exact path="/election/:uuid" component={Vote} />
      <Route exact path="/my-polls" component={MyPolls} />
    </div>
  );
}

export default App;
