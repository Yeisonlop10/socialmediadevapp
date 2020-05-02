// Bring axios to make http requests
import axios from 'axios';
// Import setAlert to show the alerts
import { setAlert} from './alert';
// Bring the types
import{
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './types';
import setAuthToken from '../utils/setauthtoken';

// Load user
export const loadUser = () => async dispatch => {
    // Check if there is a token and put a global header
    // Set the header with the token if present
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    // Make request
    try {
        //
        const res = await axios.get('/api/auth');
        // if ok dispatch this type to the reducer
        dispatch({
            type: USER_LOADED,
            payload: res.data // this should be the user
        });
    } catch (err) {
        //
        dispatch({
            type: AUTH_ERROR
        })
    }

}

// Register user
// is gonna be a function that taks in an object with name,
// email and pasword
// we also add async to the function
export const register = ({ name, email, password }) => async dispatch => {
    // 
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // stringify converts js to json string
    const body = JSON.stringify({ name, email, password});

    // try catch
    try {
        // create res for response
        // post takes in the endpoint, the body and config
        const res = await axios.post('/api/users', body, config);

        // if its ok, we don't get errors
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data // the token we get back
        });
        //
        dispatch(loadUser());
    } catch (err) {
        // Loop through the errors. It's an array of errors
        const errors = err.response.data.errors
        if(errors)
        {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        // dispatch the fail type
        dispatch({
            type: REGISTER_FAIL
        });

    }
}

// Login user
// is gonna be a function that taks in an object with name,
// email and pasword
// we also add async to the function
export const login = (email, password) => async dispatch => {
    // 
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // stringify converts js to json string
    const body = JSON.stringify({ email, password });

    // try catch
    try {
        // create res for response
        // post takes in the endpoint, the body and config
        const res = await axios.post('/api/auth', body, config);

        // if its ok, we don't get errors
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data // the token we get back
        });

        //
        dispatch(loadUser());
    } catch (err) {
        // Loop through the errors. It's an array of errors
        const errors = err.response.data.errors
        if(errors)
        {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        // dispatch the fail type
        dispatch({
            type: LOGIN_FAIL
        });

    }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });    
}
