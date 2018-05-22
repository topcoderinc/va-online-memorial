import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';

import './admin-posts.scss';
import CommonService from "../../services/common";

class AdminPosts extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeTab: 0,
    };
    this.deleteFlag = this.deleteFlag.bind(this);
  }

  activateTab = i=>{
    this.setState({
      activeTab: i,
    })
  };

  deleteFlag(flagId, type, id) {
    this.props.deleteFlag(flagId, type, id);
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
                    <span className="post-author">{item.entity.createdBy.username}</span>
                    {
                      item.others &&
                      <div className="post-author-others">and <a>{item.others} other people</a></div>
                    }
                  </div>
                  <div className="post-date">{CommonService.getCreateTime(item.entity)}</div>
                </div>
                <div className="post-title">{item.entity.title}</div>
                {
                  (posts[activeTab].type === 'Story' || posts[activeTab].type === 'Testimonial' || posts[activeTab].type === 'Event') &&
                  <div className="post-content" dangerouslySetInnerHTML={{ __html: item.entity.text }}></div>
                }
                {
                  posts[activeTab].type === 'Photo' &&
                  <img src={item.entity.photoFile.fileURL} alt=""/>
                }
                {
                  posts[activeTab].type === 'Badge' &&
                  <img src={item.entity.badgeType.iconURL} alt=""/>
                }
                <div className="post-reason-banner">
                  <h4>Reason: {get(item, 'reason', '')}</h4>
                  <div className="info">{get(item,'explanation', '')}</div>
                </div>
                {
                  !removed &&
                  <div className="post-actions">
                    <a className="btn btn-clear">
                      <span className="show-md">Email Creator</span>
                      <span className="hide-md">Email Post Creator</span>
                    </a>
                    <a className="btn" onClick={() => this.deleteFlag(item.id, item.postType, item.entity.id)}>Remove Post From Page</a>
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
};

AdminPosts.props = {
  title: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string,
  })),
  removed: PropTypes.bool,
};

export default AdminPosts;
