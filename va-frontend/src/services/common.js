import {
  DEFAULT_SERVER_ERROR
} from '../config';
import {toast} from 'react-toastify';
import * as NProgress from 'nprogress';
import * as moment from 'moment';
import {createBrowserHistory} from 'history';

const browserHistory = createBrowserHistory();

export default class CommonService {

  /**
   * get error message from request error
   * @param err the request error
   * @return {*}
   */
  static getErrorMsg(err) {

    if (!err || !err.response) {
      return "Network can not reachable, please check."
    }

    const body = err.response.body;
    if (!body || !body.message) {
      return DEFAULT_SERVER_ERROR;
    }
    return body.message;
  }

  /**
   * get browser history
   */
  static getBrowserHistory() {
    return browserHistory;
  }

  /**
   * show error or msg
   * @param err the error text or object
   */
  static showError(err) {
    if (typeof err === 'string') {
      toast(err, { type: 'error' });
    } else {
      toast(this.getErrorMsg(err), { type: 'error' })
    }
  }

  /**
   * show success msg
   * @param msg the text msg
   */
  static showSuccess(msg) {
    toast(msg, { type: 'info' });
  }

  static doRequest() {

  }

  static progressInterceptor(req) {
    req.on('request', () => {
      NProgress.start();
    });
    req.on('response', () => {
      NProgress.done();
    });
    req.on('error', () => {
      NProgress.done();
    });
  }

  /**
   * get entity author
   * @param entity the entity
   */
  static getAuthor(entity) {
    if (!entity.createdBy) {
      return 'None';
    }
    return `${entity.createdBy.firstName} ${entity.createdBy.midName} ${entity.createdBy.lastName}`;
  }

  /**
   * get format time
   * @param entity the entity
   */
  static getCreateTime(entity) {
    return moment(entity.createdAt).format('DD MMM YYYY')
  }

  /**
   * check is nok via the nok requests
   * @param nokRequests
   */
  static isNok(nokRequests) {
    for (let i = 0; i < (nokRequests.items ? nokRequests.items.length : 0); i += 1) {
      if (nokRequests.items[i].status === 'Approved') {
        return true;
      }
    }
    return false;
  }
}
