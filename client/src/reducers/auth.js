// Bring the types
import{
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from '../actions/types';

// object 
const initialState = {
    token: localStorage.getItem('token'), // We access with regular JS
    isAuthenticated: null, // null, to begin, when we receive request it changes to true
    loading: true, // To make sure the loading is done. true by default
    user: null // null y default until we get user data
}

// This function takes in 2 things:
// 1. Initial state
// 2. Action to be dispatched
export default function(state = initialState, action){
    // destructure type and payload from action
    const { type, payload } = action;
    switch(type)
    {
        // If we loaded the user
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload // The payload includes the user
            }
        // If success, we want the user logged right away
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            // Set item puts token inside localStorage
            localStorage.setItem('token', payload.token);
            return{
                ...state, // whatever is in the state
                ...payload, // Whatever is in the payload
                isAuthenticated: true, // check is authenticated
                loading: false // Loading is false now
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            // We want to remove anything that is registered in the token
            localStorage.removeItem('token');
            return{
                ...state, // whatever is in the state
                token: null, // Remove the token
                isAuthenticated: false, // check is authenticated
                loading: false // Loading is false now
            }

        default:
           return state; 

    }
}