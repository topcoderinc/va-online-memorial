import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';

import './admin-posts.scss';

class AdminPosts extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeTab: 0,
    }
  }

  activateTab = i=>{
    this.setState({
      activeTab: i,
    })
  }

  render(){
    const {title, posts, removed} = this.props;
    const { activeTab} = this.state;
    return (
      <div className="admin-posts">
        <h2 className="admin-posts-title">{title}</h2>
        <div className="admin-posts-tabs">
          {
            posts.map((p, i)=>(
              <div key={i} className={`admin-posts-tab ${activeTab === i ? 'active' : ''}`} onClick={()=>this.activateTab(i)}>
                {p.type}
                <span className="admin-posts-type-count">{p.items.length}</span>
              </div>
            ))
          }
        </div>
        <div className="admin-posts-list">
          {
            get(posts, [activeTab, 'items'], []).map((item,i)=>(
              <div key={i} className="admin-post-list-item">
                <div className="post-head">
                  <div className="post-by">
                    <span>{posts[activeTab].type}
                    </span>{posts[activeTab].type === 'Badge' ? ' from ' : ' by '}
                    <span className="post-author">{item.author}</span>
                    {
                      item.others &&
                      <div className="post-author-others">and <a>{item.others} other people</a></div>
                    }
                  </div>
                  <div className="post-date">{item.date}</div>
                </div>
                <div className="post-title">{item.title}</div>
                {
                  (posts[activeTab].type === 'Story' || posts[activeTab].type === 'Testimonial' || posts[activeTab].type === 'Event') &&
                  <div className="post-content">{item.content}</div>
                }
                {
                  (posts[activeTab].type === 'Photo' || posts[activeTab].type === 'Badge') &&
                  <img src={item.image} alt=""/>
                }
                <div className="post-reason-banner">
                  <h4>Reason: {get(item, 'reason.type', '')}</h4>
                  <div className="info">{get(item,'reason.details', '')}</div>
                </div>
                {
                  !removed &&
                  <div className="post-actions">
                    <a className="btn btn-clear">
                      <span className="show-md">Email Creator</span>
                      <span className="hide-md">Email Post Creator</span>
                    </a>
                    <a className="btn">Remove Post From Page</a>
                  </div>
                }
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

AdminPosts.defaultProps = {
  title: '',
  posts: [],
  removed: false,
}

AdminPosts.props = {
  title: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string,
  })),
  removed: PropTypes.bool,
}

export default AdminPosts;