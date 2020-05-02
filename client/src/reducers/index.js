
import { combineReducers } from 'redux';
import alert from './alert';
// bring auth
import auth from './auth';
import profile from './profile';


export default combineReducers({
    alert,
    auth,
    profile
});