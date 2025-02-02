import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';


const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    // destructure
    const { name, email, password, password2 } = formData
    
    // This handles the changes on every form input field
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // This function handles the onsubmit
    const onSubmit = async e => {
        e.preventDefault();
        //make sure passwords match
        if(password !== password2 ){
          // So we send an action sending the msg and the alert type
            setAlert('Passwords do not match', 'danger');
        }else{
            //console.log(formData);
            //console.log('SUCCESS');
            // call register
            register({ name, email, password });
        }
    }

    // redirect if logged in
    if(isAuthenticated){
      return <Redirect to="/dashboard"/>
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={e => onChange(e)}
          required />
        </div>
        <div className="form-group">
          <input 
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={e => onChange(e)}
          required />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)} 
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)} 
            minLength="6" 
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
        </Fragment>
    )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

// Bring the auth state for user authenticated
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
   { setAlert, register }
   )(Register);
