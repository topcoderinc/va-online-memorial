import React from 'react';
import PropTypes from 'prop-types';

import './setting-posts.scss';

const SettingPosts = ({posts, title})=>(
  <div className="setting-posts">
    <h2 className="setting-posts-title">{title}</h2>
    {posts.length === 0 && <div className="posts-empty">No posts yet.</div>}
    {
      posts.map((p,i)=>(
        <div key={i} className="post-section">
          <div className="post-box">
            <div className="post-by">Story by <span className="post-author">{p.author}</span></div>
            <div className="post-date">{p.date}</div>
            <div className="post-title">{p.title}</div>
            <div className="post-content">{p.content}</div>
          </div>
          <div className="post-actions">
            <a className="btn btn-clear">Decline</a>
            <a className="btn">Approve</a>
          </div>
        </div>
      ))
    }
  </div>
)

SettingPosts.defaultProps = {
  posts: [],
  title: '',
}

SettingPosts.props = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string,
  }))
}

export default SettingPosts;