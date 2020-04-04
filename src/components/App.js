import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './home.js';
import NewRecipe from './newrecipe.js';
import Navigation from './navigation.js';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Navigation />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/newrecipe" component={NewRecipe} />
          </Switch>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
