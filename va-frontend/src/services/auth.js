import superagent from 'superagent';
import superagentPromise from 'superagent-promise';

import {
  API_URL as FALLBACK_API_URL
} from '../config';
import Cookies from 'universal-cookie';
import CommonService from "./common";
import {assign} from 'lodash';

const cookies = new Cookies();
const request = superagentPromise(superagent, Promise);
const USER_STORE_KEY = 'userDetails';

export default class AuthService {
  
  /**
   * Login
   * @param credentials {object} - the login credentials
   */
  static login(credentials) {
    return request
      .post(`${FALLBACK_API_URL}/v1/login`)
      .send(credentials)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => {
        cookies.set(USER_STORE_KEY, JSON.stringify(res.body));
        return res.body;
      });
  }
  
  /**
   * Register user
   * @param body {object} - the user details object
   */
  static register(body) {
    return request
      .post(`${FALLBACK_API_URL}/v1/register`)
      .send(body)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => {
        return res.body;
      });
  }
  
  /**
   * check if user is already logged in
   */
  static getAccessToken() {
    const user = this.getCurrentUser();
    if (user) {
      return user[ 'accessToken' ];
    } else {
      CommonService.getBrowserHistory().push('/')
    }
  }
  
  /**
   * check auth is vaild
   */
  static checkAuthIsVaild() {
    const userDetails = cookies.get(USER_STORE_KEY);
    if (!userDetails || !userDetails.accessToken || !userDetails.accessTokenExpiresAt) return false;
    return new Date(userDetails.accessTokenExpiresAt) > new Date();
  }

  /**
   * get current logged user
   */
  static getCurrentUser() {
    return this.checkAuthIsVaild() ? cookies.get(USER_STORE_KEY) : null;
  }
  
  /**
   * logout system
   */
  static logout() {
    cookies.remove(USER_STORE_KEY);
  }

  /**
   * update user profile
   * @param id user id
   * @param profile user profile
   */
  static updateProfile(id, profile) {
    return request
      .put(`${FALLBACK_API_URL}/v1/users/${id}`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .send(profile)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => {
        console.log(res.body);
        cookies.set(USER_STORE_KEY, JSON.stringify(assign(cookies.get(USER_STORE_KEY), res.body)));
        return res.body;
      });
  }

  static deactivate() {
    return request
      .put(`${FALLBACK_API_URL}/v1/me/deactivate`)
      .set('Authorization', `Bearer ${AuthService.getAccessToken()}`)
      .use(CommonService.progressInterceptor)
      .end()
      .then((res) => res.body);
  }
}
