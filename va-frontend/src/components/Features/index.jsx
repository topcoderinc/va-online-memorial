import React from 'react';
import './features.scss';

const Features = ({props}) => {
  return (
    <div className="features">
      <div className="viewport">
      <h2>Features</h2>
        <div className="feature-list">
          {
            !!props.features && props.features.map((item, i)=>{
              return(
                <div key={i} className={item.title.toLowerCase() + ' feature'}>
                  <h3>{item.title}</h3>
                  <div className="info">{item.desc}</div>
                </div>
              )
            })
          }
        </div>
        <div className="actions">
          <div className="btn-wrap">
            <a className="btn">Show What's New</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features;
