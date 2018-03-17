import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';

import './admin-request.scss';

const AdminRequest = ({title, requests, archived})=>(
  <div className="admin-request">
    <h2 className="admin-request-title">{title}</h2>
    <div className="admin-request-list">
      {
        requests.map((item,i)=>(
          <div key={i} className="admin-request-list-item">
            <div className="request-head">
              <div className="request-by">
                <span>Requested by</span><span className="request-author">{item.author}</span>
              </div>
              <div className="request-date">{item.date}</div>
            </div>
            <div className="veteran-info">
              <div className="info-left-group">
                <img src={item.photo} alt=""/>
                <div>
                  <div className="veteran-name">{item.name}</div>
                  <div className="veteran-birth-death">{item.birth} — {item.death}</div>
                </div>
              </div>
              <a className="btn">Veteran's Profile</a>
            </div>
            <div className="submitted-proof">
              <div className="proof-head">
                <span>Submitted Proof</span>
                <a className="btn">Download</a>
              </div>
              {
                get(item, 'proof', []).map((p, j)=>(
                  <div key={j} className="proof-item"><a>{p}</a></div>
                ))
              }
            </div>
            {
              !archived &&
              <div className="request-actions">
                <a className="btn btn-clear">
                  <span className="hide-md">Email Post Creator</span>
                  <span className="show-md">Email Creator</span>
                </a>
                <a className="btn">Decline</a>
                <a className="btn">Approve</a>
              </div>
            }
          </div>
        ))
      }
    </div>
  </div>
)

AdminRequest.defaultProps = {
  title: '',
  requests: [],
  archived: false,
}

AdminRequest.props = {
  title: PropTypes.string,
  requests: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string,
  })),
  archived: PropTypes.bool,
}

export default AdminRequest;