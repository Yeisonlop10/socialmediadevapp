// Bring the alerts
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

//initial state
const initialState = [
];

export default function(state = initialState, action){

    // destructure for action
    const { type, payload } = action;
    switch(type){
        // Depending on the type we decide
        // what to send for state
        case SET_ALERT:
            // State is immutable. So we include any other state
            // so we use the spread operator to include the state and
            // also add the action and the data(payload)
            return [...state, payload];
        // iN THE CASE OF REMOVE, WE DELETE BY ID
        case REMOVE_ALERT:
            // Return all the alerts except the one that matches the payload
            return state.filter(alert => alert.id !== payload);
        default:
            return state;    
    }
}