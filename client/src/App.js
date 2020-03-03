import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
// Bring Redux
import { Provider } from 'react-redux'; // This connects react and redux
import store from './store';// Bring the store

const App = () => (
  // Wrap everything in provider to use it and pass the store in
  <Provider store={store}> 
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path='/'component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/register"component={Register}/>
          <Route exact path="/login"component={Login}/>
        </Switch>
      </section>
    </Fragment>
  </Router>
  </Provider>
);

export default App;
