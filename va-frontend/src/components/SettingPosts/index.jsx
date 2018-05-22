import React from 'react';
import PropTypes from 'prop-types';
import CommonService from "../../services/common";

import './setting-posts.scss';

const SettingPosts = ({ posts, title, declinePost, approvePost, needDelete, deletePost }) => (
  <div className="setting-posts">
    <h2 className="setting-posts-title">{title}</h2>
    {posts.length === 0 && <div className="posts-empty">No posts yet.</div>}
    {
      posts.map((p, i) => (
        <div key={i} className="post-section">
          <div className="post-box">
            <div className="post-by">Story by <span className="post-author">{p.createdBy.username}</span></div>
            <div className="post-date">{CommonService.getCreateTime(p)}</div>
            <div className="post-title">{p.title}</div>
            <div className="post-content">{p.text}</div>
          </div>
          
          {needDelete ?
            <div className="post-actions">
              <a className="btn btn-clear" onClick={() => deletePost(p.id)}>Delete</a>
            </div> :
            <div className="post-actions">
              <a className="btn btn-clear" onClick={() => declinePost(p.id)}>Decline</a>
              <a className="btn" onClick={() => approvePost(p.id)}>Approve</a>
            </div>}
        </div>
      ))
    }
  </div>
);

SettingPosts.defaultProps = {
  posts: [],
  title: '',
  needDelete: false,
};

SettingPosts.props = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    text: PropTypes.string,
    needDelete: PropTypes.bool,
  }))
};

export default SettingPosts;
