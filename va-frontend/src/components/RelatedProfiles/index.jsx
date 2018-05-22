import React from 'react';
import './styles.scss';
import {Link} from "react-router-dom";

class RelatedProfiles extends React.Component {
  
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      limit: 4,
    };
  }
  
  loadMore() {
    this.setState({ limit: this.state.limit + 4 });
  }
  
  render() {
    const { profiles } = this.props.props;
    return (
      <div className="profile-cards">
        <h3>Related Profile</h3>
        <div className="viewport">
          {profiles.map((item, i) => {
            if (i >= this.state.limit) return null;
            return (
              <div key={i} className="profile-card">
                <img src={item.imgSrc} alt=""/>
                <h4><Link to={`/dashboard/${item.id}`}>{item.name}</Link></h4>
                <div className="life-el">{item.life}</div>
              </div>
            )
          })}
        </div>
        {this.state.limit < profiles.length ?
          <div className="action"><a onClick={this.loadMore} className="btn btn-more">View More Related</a></div>
          : <div className="space"/>
        }
      </div>
    )
  }
}

export default RelatedProfiles;
