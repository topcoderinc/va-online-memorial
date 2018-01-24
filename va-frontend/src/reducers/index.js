import { combineReducers } from 'redux';
import auth from './auth.js';

const allReducers = combineReducers({ auth });

export default allReducers;
