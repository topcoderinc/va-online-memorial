import React from 'react';
import './styles.scss';

const RelatedProfiles = ({props}) => {
  const profiles = props.profiles;
  return (
    <div className="profile-cards">
      <h3>Related Profile</h3>
      <div className="viewport">
      {profiles.map((item,i)=>{
        return(
          <div key={i} className="profile-card">
            <img src={item.imgSrc} alt=""/>
            <h4><a>{item.name}</a></h4>
            <div className="life-el">{item.life}</div>
          </div>
        )
      })}
      </div>
      <div className="action"><a className="btn btn-more">View More Related</a></div>
    </div>
  )
}

export default RelatedProfiles;
