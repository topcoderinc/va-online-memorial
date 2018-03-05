import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stories from '../../components/Stories';
import Testimonials from '../../components/Testimonials';
import Badges from '../../components/Badges';
import Photos from '../../components/Photos';
import './styles.scss';

class ProfileInfoTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "stories"
    };
  }
  
  render() {
    const tabNavs = this.props.tabs;
    const stories = this.props.stories;
    const testimonials = this.props.testimonials;
    const badges = this.props.badges;
    const photos = this.props.photos;

    const stObj = { stories: stories, profileName: this.props.profileName};
    const testiObj = { stories: testimonials, profileName: this.props.profileName};
    const badgesObj = { stories: badges, profileName: this.props.profileName};
    const photosObj = { stories: photos, profileName: this.props.profileName};
    
    return (
      <div className="profile-tabs">
        <div className="tabnav-view">
          <nav className="bar-tabnavs viewport">
            {
              tabNavs.map((item,i)=>{
                return (
                  <a key={i} className={"tabnav " + item.id + (this.state.activeTab === item.id ? ' active': '')}
                    onClick={()=>{this.setState({activeTab: item.id}) }}
                  >
                    <span className="i-count">{item.count}</span> <span className="i-name">{item.name}</span>
                  </a>
                )
              })
            }
          </nav>
          <div className="tab-con">
            {this.state.activeTab==='stories' && <Stories {...stObj} />}
            {this.state.activeTab === 'testimonials' && <Testimonials {...testiObj} />}
            {this.state.activeTab === 'badges' && <Badges {...badgesObj} />}
            {this.state.activeTab === 'photos' && <Photos {...photosObj} />}
          </div>
        </div> 
      </div>
    )
  }
}

ProfileInfoTabs.propTypes = {
  props: PropTypes.object
}
export default ProfileInfoTabs;
