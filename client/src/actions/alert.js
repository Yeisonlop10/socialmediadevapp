import {v4 as uuidv4} from "uuid";
import { SET_ALERT, REMOVE_ALERT } from './types';

// To dispatch more than one action type. We use dispatch to modify the
// arrow function thanks to thunk middleware
export const setAlert = (msg, alertType) => dispatch => {
    // using uuid
    const id = uuidv4();
    //
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id}
    });
};