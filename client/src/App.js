import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
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
          <Route exact path="/profiles"component={Profiles}/>
          <Route exact path="/profile/:id"component={Profile}/>
          <PrivateRoute exact path="/dashboard"component={Dashboard}/>
          <PrivateRoute exact path="/create-profile"component={CreateProfile}/>
          <PrivateRoute exact path="/edit-profile"component={EditProfile}/>
          <PrivateRoute exact path="/add-experience"component={AddExperience}/>
          <PrivateRoute exact path="/add-education"component={AddEducation}/>
          <PrivateRoute exact path="/posts"component={Posts}/>
          <PrivateRoute exact path="/posts/:id"component={Post}/>
        </Switch>
      </section>
    </Fragment>
  </Router>
  </Provider>
)};

export default App;
