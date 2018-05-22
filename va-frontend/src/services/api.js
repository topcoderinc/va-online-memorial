import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import {toast} from 'react-toastify';

import {
  API_URL as FALLBACK_API_URL
} from '../config';
import CommonService from "./common";
import AuthService from "./auth";

const request = superagentPromise(superagent, Promise);
const postUrl = {
  Story: 'stories',
  Photo: 'photos',
  Badge: 'badges',
  Testimonial: 'testimonials'
};

const errorRedirect = (req) => {
  req.on('response', function (res) {
    if (res.status === 401) { // unauth
      // do something else
    } else if (res.status === 403) {
      // do tip
      toast(res.body.message || 'Operation forbidden', { type: 'error' });
    }
  });
};

/**
 * clear invalid params
 * @param query
 * @return {*}
 */
const clearInvalidParams = (query) => {
  if (query && query.name === "") {
    delete query.name;
  }
  if (query && query.squadronShip === "") {
    delete query.squadronShip;
  }
  if (query && query.branchIds === "0") {
    delete query.branchIds;
  }
  if (query && query.cemeteryId === "0") {
    delete query.cemeteryId;
  }
  delete query.served;
  delete query.division;
  return query;
};

export default class APIService {
  
  /**
   * get veteran by id
   * @param id the veteran id
   */
  static getVeteranById(id) {
    return request
      .get(`${FALLBACK_API_URL}/v1/veterans/${id}`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get relate veteran by id
   * @param id the veteran id
   */
  static getVeteranRelateById(id) {
    return request
      .get(`${FALLBACK_API_URL}/v1/veterans/${id}/related`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get event types
   */
  static getEventTypes() {
    return request
      .get(`${FALLBACK_API_URL}/v1/eventTypes`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get badge types
   */
  static getbadgeTypes() {
    return request
      .get(`${FALLBACK_API_URL}/v1/badgeTypes`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get veteran events
   * @param id the veteran id
   */
  static getVeteranEvents(id) {
    return request
      .get(`${FALLBACK_API_URL}/v1/events?veteranId=${id}`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * create event for veteran
   * @param entity the event entity
   */
  static createEvent(entity) {
    return request
      .post(`${FALLBACK_API_URL}/v1/events`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(entity)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * create testimonial for veteran
   * @param entity the testimonial entity
   */
  static createTestimonial(entity) {
    return request
      .post(`${FALLBACK_API_URL}/v1/testimonials`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(entity)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * create story for veteran
   * @param entity the story entity
   */
  static createStory(entity) {
    return request
      .post(`${FALLBACK_API_URL}/v1/stories`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(entity)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * create badges
   * @param entity the badge entity
   */
  static createBadge(entity) {
    return request
      .post(`${FALLBACK_API_URL}/v1/badges`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(entity)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * upload photo to server
   * @param file the file entity
   * @param title the title
   * @param veteranId the veteran id
   */
  static uploadPhoto(file, title, veteranId) {
    const formData = new FormData();
    formData.append('veteranId', veteranId);
    formData.append('file', file);
    formData.append('status', 'Requested');
    formData.append('title', title);
    
    return request
      .post(`${FALLBACK_API_URL}/v1/photos`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(formData)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get stories
   * @param query the query entity
   */
  static getStories(query) {
    return request
      .get(`${FALLBACK_API_URL}/v1/stories`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .query(query)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get photos
   * @param query the query entity
   */
  static getPhotos(query) {
    return request
      .get(`${FALLBACK_API_URL}/v1/photos`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .query(query)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get testimonials
   * @param query the query entity
   */
  static getTestimonials(query) {
    return request
      .get(`${FALLBACK_API_URL}/v1/testimonials`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .query(query)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get badges
   * @param query the query entity
   */
  static getBadges(query) {
    return request
      .get(`${FALLBACK_API_URL}/v1/badges`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .query(query)
      .use(CommonService.progressInterceptor).end()
      .then((res) => res.body);
  }
  
  /**
   * search veterans
   * @param query
   */
  static searchVeterans(query) {
    return request
      .get(`${FALLBACK_API_URL}/v1/veterans`)
      .query(clearInvalidParams(query))
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get all branches
   */
  static getAllBranches() {
    return request
      .get(`${FALLBACK_API_URL}/v1/branches`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get all cemeteries
   */
  static getAllCemeteries() {
    return request
      .get(`${FALLBACK_API_URL}/v1/cemeteries`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * create next Of Kin
   * @param files the proof files
   * @param userId the user id
   * @param veteranId the veteran id
   * @param fullName the full name
   * @param email the email address
   */
  static createNextOfKin(files, userId, veteranId, fullName, email) {
    const formData = new FormData();
    formData.append('veteranId', veteranId);
    files.forEach((f, index) => {
      formData.append(`file-${index}`, f);
    });
    formData.append('status', 'Requested');
    formData.append('userId', userId);
    formData.append('email', email);
    formData.append('fullName', fullName);
    
    return request
      .post(`${FALLBACK_API_URL}/v1/nextOfKins`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(formData)
      .use(CommonService.progressInterceptor)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get submitted next of kin request
   * @param query query object
   */
  static getNOKRequests(query) {
    return request
      .get(`${FALLBACK_API_URL}/v1/nextOfKins`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .query(query)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  static deleteNOKRequest(id) {
    return request
      .del(`${FALLBACK_API_URL}/v1/nextOfKins/${id}`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get preferences setting
   */
  static getPreferences() {
    return request
      .get(`${FALLBACK_API_URL}/v1/me/notificationPreferences`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * update preferences
   * @param preferences
   */
  static updatePreferences(preferences) {
    return request
      .put(`${FALLBACK_API_URL}/v1/me/notificationPreferences`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(preferences)
      .use(CommonService.progressInterceptor)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * create new flag
   * @param entity the flag entity
   */
  static createFlag(entity) {
    return request
      .post(`${FALLBACK_API_URL}/v1/flags`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(entity)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * decline post by id
   * @param id post id
   */
  static declinePost(id) {
    return request
      .put(`${FALLBACK_API_URL}/v1/stories/${id}/reject`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * approve post by id
   * @param id post id
   */
  static approvePost(id) {
    return request
      .put(`${FALLBACK_API_URL}/v1/stories/${id}/approve`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * approve NOK request by id
   * @param id
   */
  static approveRequest(id) {
    return request
      .put(`${FALLBACK_API_URL}/v1/nextOfKins/${id}/approve`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * decline NOK request by id
   * @param id
   */
  static declineRequest(id) {
    return request
      .put(`${FALLBACK_API_URL}/v1/nextOfKins/${id}/decline`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(errorRedirect)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * get flags
   */
  static getFlags() {
    return request
      .get(`${FALLBACK_API_URL}/v1/flags`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(errorRedirect)
      .end()
      .then((res) => res.body);
  }
  
  static deleteFlag(id) {
    return request
      .del(`${FALLBACK_API_URL}/v1/flags/${id}`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * delete post by type and id
   * @param type post type
   * @param id entity id
   */
  static deletePost(type, id) {
    return request
      .del(`${FALLBACK_API_URL}/v1/${postUrl[ type ]}/${id}`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * download file by url
   * @param url
   */
  static downloadFile(url) {
    return request
      .get(url)
      .responseType('blob')
      .accept('application/octet-stream')
      .end()
      .then((res) => {
        res.xhr.fileName = res.header[ 'content-filename' ];
        return res.xhr;
      });
  }
  
  /**
   * check is isSaluted
   * @param type the post type
   * @param id the id
   */
  static isSaluted(type, id) {
    return request
      .get(`${FALLBACK_API_URL}/v1/${postUrl[ type ]}/${id}/isSaluted`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * salute post
   * @param type the type
   * @param id the id
   */
  static salutePost(type, id) {
    return request
      .put(`${FALLBACK_API_URL}/v1/${postUrl[ type ]}/${id}/salute`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
  
  /**
   * share post
   * @param type the type
   * @param id the id
   */
  static sharePost(type, id) {
    return request
      .put(`${FALLBACK_API_URL}/v1/${postUrl[ type ]}/${id}/share`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
}
