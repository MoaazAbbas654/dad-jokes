import React, { Component } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import "./App.css";
import Dadjokes from "./Dadjokes";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Dadjokes />
      </div>
    );
  }
}

export default App;
