import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
// Bring Redux
import { Provider } from 'react-redux'; // This connects react and redux
import store from './store';// Bring the store
//
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setauthtoken';

// It runs just the first time
if(localStorage.token){
  setAuthToken(localStorage.setAuthToken);
}

const App = () => { 
  //
  useEffect(() => {
    //
    store.dispatch(loadUser);
  }, []); // Adding the [] will make the function to run just once
  return (
  // Wrap everything in provider to use it and pass the store in
  <Provider store={store}> 
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path='/'component={Landing} />
        <section className="container">
          <Alert />
        <Switch>
          <Route exact path="/register"component={Register}/>
          <Route exact path="/login"component={Login}/>
          <PrivateRoute exact path="/dashboard"component={Dashboard}/>
        </Switch>
      </section>
    </Fragment>
  </Router>
  </Provider>
)};

export default App;
