import * as types from '../constants/actionTypes';
import dataSvc from '../services/dataSvc';
import API from '../services/api';
import AuthService from "../services/auth";
import fileSaver from 'file-saver';
import {toast} from 'react-toastify';
import {map, assign, each, keys, lowerCase, cloneDeep} from 'lodash';

/**
 * handle flagged to match frontend structure
 * @param data
 * @returns {*}
 */
const handleFlaggedPosts = (data) => {
  const temp = {};
  each(data.items, item => {
    if (!temp[ item.postType ]) {
      temp[ item.postType ] = [];
    }
    item[ 'entity' ] = item[ lowerCase(item.postType) ];
    delete item[ lowerCase(item.postType) ];
    temp[ item.postType ].push(item);
  });
  return map(keys(temp), key => { return { type: key, items: temp[ key ] } });
};

// loads Data
function loadData(data) {
  return { type: types.LOAD_DATA, data };
}

// load veterans data
function loadVeterans(data) {
  data.items = map(data.items, item => assign(item, {
    name: `${item.firstName || ''} ${item.midName || ''} ${item.lastName || ''}`,
    life: `${new Date(item[ 'birthDate' ]).getFullYear()} - ${new Date(item[ 'deathDate' ]).getFullYear()}`,
    burriedAt: !!item.cemeteryId ? item.cemetery.name : '',
  }));
  return { type: types.LOAD_VETERANS, data };
}

// load veterans name data
function loadVeteransName(data) {
  data.items = map(data.items, item => assign(item, {
    name: `${item.firstName || ''} ${item.midName || ''} ${item.lastName || ''}`,
  }));
  return { type: types.LOAD_VETERANS_NAME, data };
}

// load branches data for select field
function loadBranches(data) {
  return { type: types.LOAD_BRANCHES, data };
}

// update global filter data
function updateFilters(data) {
  return { type: types.UPDATE_FILTERS, data };
}

// load cemeteries data for select field
function loadCemeteries(data) {
  return { type: types.LOAD_CEMETERIES, data };
}

// load preferences data
function loadPreferences(data) {
  return { type: types.LOAD_PREFERENCES, data };
}

// load nok requests data
function loadNOKRequests(data) {
  return { type: types.LOAD_NOK_REQUEST, data };
}

// load my post for admin
function loadMyPosts(data) {
  return { type: types.LOAD_MY_POSTS, data };
}

// load review posts
function loadReviewPosts(data) {
  return { type: types.LOAD_REVIEW_POSTS, data };
}

// load not review requests
function loadNOKReviewRequests(data) {
  return { type: types.LOAD_NOK_REVIEW_REQUEST, data };
}

// load all archived nok request
function loadNOKArchivedRequests(data) {
  return { type: types.LOAD_NOK_ARCHIVED_REQUEST, data };
}

// load flagged posts
function loadFlaggedPosts(data) {
  return { type: types.LOAD_FLAGGED_POSTS, data: handleFlaggedPosts(data) };
}

// get data
function getData() {
  return function (dispatch) {
    
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

/**
 * search veterans
 * @param query query params
 * @returns {Function}
 */
function searchVeterans(query) {
  console.log(query);
  return function (dispatch) {
    API.searchVeterans(cloneDeep(query)).then(data => {
      dispatch(loadVeterans(data));
      console.log(query);
      dispatch(updateFilters({ ...query, offset: data.offset, limit: data.limit }));
    });
  }
}

function getVeteransName(query) {
  return function (dispatch) {
    API.searchVeterans(query).then(data => {
      dispatch(loadVeteransName(data));
    });
  }
}

/**
 * get all branches
 * @returns {Function}
 */
function getAllBranches() {
  return function (dispatch) {
    API.getAllBranches().then(data => {
      dispatch(loadBranches(data));
    });
  }
}

/**
 * get all cemeteries
 * @returns {Function}
 */
function getAllCemeteries() {
  return function (dispatch) {
    API.getAllCemeteries().then(data => {
      dispatch(loadCemeteries(data));
    })
  }
}

/**
 * reset filter
 * @returns {Function}
 */
function resetFilter() {
  return function (dispatch) {
    dispatch(updateFilters({}));
  }
}

/**
 * get notification preferences
 * @returns {Function}
 */
function getPreferences() {
  return function (dispatch) {
    API.getPreferences().then(data => {
      dispatch(loadPreferences(data));
    }).catch(() => {
      dispatch(loadPreferences({}));
    });
  }
}

/**
 * update notification preferences
 * @param preferences
 * @returns {Function}
 */
function updatePreferences(preferences) {
  delete preferences.id;
  delete preferences.userId;
  return function (dispatch) {
    API.updatePreferences(preferences).then(data => {
      dispatch(loadPreferences(data));
      toast('preferences update success', { type: 'info' });
    });
  }
}

/**
 * create nok request
 * @param files proofs
 * @param userId current user id
 * @param veteranId veteran id
 * @param fullName user full name
 * @param email user email
 * @returns {Function}
 */
function createNextOfKin(files, userId, veteranId, fullName, email) {
  return function (dispatch) {
    API.createNextOfKin(files, userId, veteranId, fullName, email).then(() => {
      API.getNOKRequests({ userId }).then(data => {
        dispatch(loadNOKRequests(data));
      });
      toast('request send success, please wait for review', { type: 'info' });
    });
  }
}

/**
 * delete nok request
 * @param userId current user id
 * @param id request id
 * @returns {Function}
 */
function deleteNOKRequest(userId, id) {
  return function (dispatch) {
    API.deleteNOKRequest(id).then(() => {
      API.getNOKRequests({ userId }).then(data => {
        dispatch(loadNOKRequests(data));
      });
    });
  }
}

/**
 * search nok request
 * @param query query params
 * @returns {Function}
 */
function getNOKRequests(query) {
  return function (dispatch) {
    API.getNOKRequests(query).then(data => {
      dispatch(loadNOKRequests(data));
    });
  }
}

/**
 * get nok request for review
 * @param query query params for search nok requests
 * @returns {Function}
 */
function getNOKReviewRequests(query) {
  return function (dispatch) {
    API.getNOKRequests(query).then(data => {
      dispatch(loadNOKReviewRequests(data));
    });
  }
}

/**
 * get all nok requests that are approved
 * @param query query params
 * @returns {Function}
 */
function getNOKArchivedRequests(query) {
  return function (dispatch) {
    API.getNOKRequests(query).then(data => {
      dispatch(loadNOKArchivedRequests(data));
    });
  }
}

/**
 * get user posts
 * @returns {Function}
 */
function getMyPosts() {
  const currentUser = AuthService.getCurrentUser();
  return function (dispatch) {
    API.getStories({ userId: currentUser.id, status: 'Requested' }).then(data => {
      dispatch(loadMyPosts(data));
    });
  }
}

/**
 * get posts for review
 * @returns {Function}
 */
function getReviewPosts() {
  return function (dispatch) {
    API.getStories({ status: 'Requested', review: true }).then(data => {
      dispatch(loadReviewPosts(data));
    });
  }
}

/**
 * update post list
 * @param dispatch
 */
function updatePost(dispatch) {
  const currentUser = AuthService.getCurrentUser();
  API.getStories({ userId: currentUser.id, status: 'Requested' }).then(data => {
    dispatch(loadMyPosts(data));
  });
  API.getStories({ status: 'Requested', review: true }).then(data => {
    dispatch(loadReviewPosts(data));
  });
}

/**
 * approve post by post id
 * @param id post id
 * @returns {Function}
 */
function approvePost(id) {
  return function (dispatch) {
    API.approvePost(id).then(() => {
      updatePost(dispatch);
      toast('approve success', { type: 'info' });
    });
  }
}

/**
 * decline post by post id
 * @param id post id
 * @returns {Function}
 */
function declinePost(id) {
  return function (dispatch) {
    API.declinePost(id).then(() => {
      updatePost(dispatch);
      toast('decline success', { type: 'info' });
    });
  }
}

/**
 * update request list
 * @param dispatch
 */
function updateRequest(dispatch) {
  API.getNOKRequests({ status: 'Requested' }).then(data => {
    dispatch(loadNOKReviewRequests(data));
  });
  API.getNOKRequests({ status: 'Approved' }).then(data => {
    dispatch(loadNOKArchivedRequests(data));
  });
}

/**
 * approve nok request
 * @param id request id
 * @returns {Function}
 */
function approveRequest(id) {
  return function (dispatch) {
    API.approveRequest(id).then(() => {
      updateRequest(dispatch);
      toast('approve success', { type: 'info' });
    });
  };
}

/**
 * decline nok request
 * @param id request id
 * @returns {Function}
 */
function declineRequest(id) {
  return function (dispatch) {
    API.declineRequest(id).then(() => {
      updateRequest(dispatch);
      toast('decline success', { type: 'info' });
    });
  }
}

/**
 * get all flagged post
 * @returns {Function}
 */
function getFlags() {
  return function (dispatch) {
    API.getFlags().then((data) => {
      dispatch(loadFlaggedPosts(data));
    });
  }
}

/**
 * remove flagged post
 * @param flagId flag id
 * @param type post type
 * @param id post id
 * @returns {Function}
 */
function deleteFlag(flagId, type, id) {
  return function (dispatch) {
    API.deleteFlag(flagId).then(() => {
      API.deletePost(type, id).then(() => {});
      API.getFlags().then((data) => {
        dispatch(loadFlaggedPosts(data));
        toast('remove post from page success', { type: 'info' });
      });
    });
  }
}

/**
 * remove flagged post
 * @param type post type
 * @param id post id
 * @returns {Function}
 */
function deletePost(type, id) {
  return function (dispatch) {
    API.deletePost(type, id).then((data) => {
      toast('remove story from page success', { type: 'info' });
      getMyPosts()(dispatch);
    });
  }
}

/**
 * download file
 * @param file file object
 */
function downloadFile(file) {
  return function () {
    API.downloadFile(file.fileURL).then(res => {
      const blob = new Blob([ res.response ], { type: file.mimeType });
      fileSaver.saveAs(blob, (file.name));
      toast('file download success', { type: 'info' });
    });
  }
}

export default {
  getData,
  loadData,
  searchVeterans,
  getAllBranches,
  getAllCemeteries,
  resetFilter,
  getPreferences,
  updatePreferences,
  createNextOfKin,
  getNOKRequests,
  deleteNOKRequest,
  getReviewPosts,
  getMyPosts,
  approvePost,
  declinePost,
  downloadFile,
  getNOKArchivedRequests,
  getNOKReviewRequests,
  declineRequest,
  approveRequest,
  getFlags,
  deleteFlag,
  deletePost,
  getVeteransName,
};

