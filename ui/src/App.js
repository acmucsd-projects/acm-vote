import React from 'react';
import Header from './components/Header/Header';
import Home from "./Home";
import Login from "./Login";
import CreatePoll from './pages/CreatePoll';
import './App.css';
import {Router, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login}/>
      <Route exact path="/create" component={CreatePoll} />
      </Router>
    </div>
  );
}

export default App;
