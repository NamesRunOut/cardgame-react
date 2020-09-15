import React from 'react';
import logo from './logo.svg';
import './css/main.css';
import Navbar from './components/navbar.js'
import Main from './components/main.js'
import Cards from './components/cards.js'
import Info from './components/info.js'

function App() {
  return (
    <div id="wrapper">
      <Navbar />
      <Main />
      <Cards />
      <Info />
    </div>
  );
}

/*      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>*/

export default App;
