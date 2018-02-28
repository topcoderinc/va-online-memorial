import { combineReducers } from 'redux';
import auth from './auth.js';
import dataReducer from './dataReducer.js';

const allReducers = combineReducers({ auth, dataReducer });

export default allReducers;
