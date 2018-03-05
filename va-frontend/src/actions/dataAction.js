import * as types from '../constants/actionTypes';
import dataSvc from '../services/dataSvc';

// loads Data
export function loadData(data) {
  return { type: types.LOAD_DATA, data };
}

// get data
export function getData() {
  return function(dispatch) {

    // fetches remote data
    dataSvc.getData()
      .then(data => {
        // load data
        dispatch(loadData(data));
      }).catch(error => {
        throw (error);
      })
  }
}

export default {
  getData
};

