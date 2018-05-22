import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import { NavLink } from 'react-router-dom';

import './admin-request.scss';

const AdminRequest = ({title, requests, archived, downloadFile, decline, approve })=>(
  <div className="admin-request">
    <h2 className="admin-request-title">{title}</h2>
    <div className="admin-request-list">
      {
        requests.map((item,i)=>(
          <div key={i} className="admin-request-list-item">
            <div className="request-head">
              <div className="request-by">
                <span>Requested by</span><span className="request-author">{item.createdBy.username}</span>
              </div>
              <div className="request-date">{item.date}</div>
            </div>
            <div className="veteran-info">
              <div className="info-left-group">
                <img src={item.photo || '/rp3.png'} alt=""/>
                <div>
                  <div className="veteran-name">{`${item.veteran.firstName} ${item.veteran.midName} ${item.veteran.lastName}`}</div>
                  <div className="veteran-birth-death">{`${new Date(item.veteran[ 'birthDate' ]).getFullYear()} - ${new Date(item.veteran[ 'deathDate' ]).getFullYear()}`}</div>
                </div>
              </div>
              <NavLink to={`/dashboard/${item.id}`} className="btn">Veteran's Profile</NavLink>
            </div>
            <div className="submitted-proof">
              <div className="proof-head">
                <span>Submitted Proof</span>
                <a className="btn">Download</a>
              </div>
              {
                get(item, 'proofs', []).map((p, j)=>(
                  <div key={j} className="proof-item"><a onClick={() => downloadFile(p)} >{p.name}</a></div>
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
                <a className="btn" onClick={() => decline(item.id)}>Decline</a>
                <a className="btn" onClick={() => approve(item.id)}>Approve</a>
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
