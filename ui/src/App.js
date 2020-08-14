import React from 'react';
import Header from './components/Header/Header';
import Home from "./Home";
import Login from "./Login";
import './App.css';
import {Route, Link} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header imgLink="profile.png" />
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login}/>
    </div>
  );
}

export default App;
