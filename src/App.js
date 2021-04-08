import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Homepage from './pages/Homepage';
import Contact from './pages/Contact'

import {Socket} from './hooks/Socket.js'

import './css/main.css';

function App() {

  return (
    <Router>
      <Switch>
        <Socket>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/contact" component={Contact} />
        </Socket>
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </Router>
  );
}

export default App;
