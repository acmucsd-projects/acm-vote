import React from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreatePoll from './pages/CreatePoll';
import './App.css';
import {Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login}/>
      <Route exact path="/create" component={CreatePoll} />
    </div>
  );
}

export default App;
