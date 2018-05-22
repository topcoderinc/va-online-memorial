import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import CommonService from "../../services/common";
import APIService from "../../services/api";

class Badges extends Component {
  constructor(props) {
    super(props);
    this.setActiveStory = this.setActiveStory.bind(this);
    this.clearActiveStory = this.clearActiveStory.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setStoryNextPrevIndex = this.setStoryNextPrevIndex.bind(this);
    
    this.state = {
      activeStory: '',
      prevStory: '',
      nextStory: '',
      saluted: false,
    };
    this.type = 'Badge';
  }
  
  componentDidMount() {
    this.setState({
      prevStory: this.props.stories[ 1 ],
      nextStory: this.props.stories[ 3 ]
    });
  }
  
  setActiveStory(index) {
    this.setState({
      activeStory: this.props.stories[ index ],
      activeSlideIndex: index
    });
    APIService.isSaluted(this.type, this.props.stories[ index ].id).then((rsp) => {
      this.setState({ saluted: rsp.saluted });
    });
    this.setStoryNextPrevIndex(index, this.props.stories.length);
  }
  
  /**
   * salute post
   */
  salutePost() {
    APIService.salutePost(this.type, this.state.activeStory.id).then(() => {
      this.setState({ saluted: true });
      CommonService.showSuccess("Story salute successfully");
    }).catch(err => CommonService.showError(err));
  }
  
  /**
   * share post
   */
  sharePost() {
    APIService.sharePost(this.type, this.state.activeStory.id).then(() => {
      this.setState({ saluted: true });
      CommonService.showSuccess("Story salute successfully");
    }).catch(err => CommonService.showError(err));
  }
  
  clearActiveStory() {
    this.setState({
      activeStory: ''
    });
  }
  
  next() {
    const len = this.props.stories.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex += 1;
    newIndex = Math.min(newIndex, len - 1);
    this.setStoryNextPrevIndex(newIndex, len);
  }
  
  prev() {
    const len = this.props.stories.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex -= 1;
    newIndex = Math.max(newIndex, 0);
    this.setStoryNextPrevIndex(newIndex, len);
  }
  
  setStoryNextPrevIndex(newIndex, len) {
    const prevIndex = Math.max(newIndex - 1, 0);
    const nextIndex = Math.min(newIndex + 1, len - 1);
    this.setState({
      activeStory: this.props.stories[ newIndex ],
      activeSlideIndex: newIndex,
      prevStory: this.props.stories[ prevIndex ],
      nextStory: this.props.stories[ nextIndex ]
    });
  }
  
  render() {
    const stories = this.props.stories;
    const profileName = this.props.profileName;
    const activeStory = this.state.activeStory;
    
    return (
      <div className="collection-list-wrap collection-badges">
        <h3 className="title">Badges for {profileName}</h3>
        <span className="opts">
          <a className="btn btn-rt-2 btn-search"> </a>
          <a className="btn btn-badge btn-rt-1"><span className="tx">Add Badge</span> </a>
        </span>
        
        
        {!this.state.activeStory
          ? (
            <div>
              <div className="viewport bd-collection-view">
                {stories.map((item, i) => {
                  return (
                    <div key={i} className="bd-collection-item-card-wrap">
                      <div className="collection-item-card con-centered  con-badge"
                           onClick={() => { this.setActiveStory(i) }}>
                        <div className="desc desc-md">
                          <figure className={"fig-badge " + item.badgeType.iconURL}/>
                        </div>
                        <h5>{item.badgeType.name}</h5>
                      </div>
                      <div className="caption">Badge from <strong>{item.createdBy.username}</strong></div>
                      <div className="date">{CommonService.getCreateTime(item)}</div>
                    </div>
                  )
                })
                }
              </div>
              {
                (this.props.total && this.props.items && this.props.items.length < this.props.total) ?
                  <div className="action">
                    <a className="btn btn-more"
                       onClick={() => this.props.fetchBadges(this.props.offset + this.props.limit)}>Load More
                      Badges</a>
                  </div>
                  : <div className={"space"}/>
              }
            </div>
          )
          : (
            <div className="viewport fullstory-view">
              <div className="fullstory-slide">
                <div className="fullstory-card fullstory-card-md alt">
                  <div className="postedby">Badge from <strong>{activeStory.createdBy.username}</strong>
                    <span className="hide-md">and <a>5 other pepole</a></span></div>
                  <div className="dateval">{CommonService.getCreateTime(activeStory)}</div>
                  <a className="close"
                     onClick={this.clearActiveStory}
                  > </a>
                  <a className="flag" onClick={() => window.showProfileFlagPopUp('Badge', activeStory.id)}>{''}</a>
                  
                  <article className="article centered article-badges">
                    
                    <h3 className="show-md">{activeStory.title}</h3>
                    <div className="fullstory">
                      <figure className={"fig-badge bdg-md " + activeStory.badgeType.iconURL}></figure>
                    </div>
                    <h3 className="hide-md">{activeStory.badgeType.name}</h3>
                    
                    <footer className="article-footer alt">
                      <div className="col col-meta">
                        <div className="meta-gr">
                          <h6>Views</h6>
                          <div className="meta-val reads">
                            {'1,333'}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Salutes</h6>
                          <div className="meta-val salutes">
                            {'469'}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Shares</h6>
                          <div className="meta-val shares">
                            {'256'}
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <a className={`btn btn-salute2 ${this.state.saluted ? ' disabled' : ''}`}
                           onClick={() => this.state.saluted ? null : this.salutePost()}
                           disabled={this.state.saluted}>Salute{this.state.saluted ? 'd' : ''}</a>
                        <a className="btn btn-share" onClick={() => this.sharePost()}>Share</a>
                      </div>
                    </footer>
                    
                    {!!this.state.activeSlideIndex > 0
                    && (<a className="slide-arrow prev"
                           onClick={this.prev}
                    > </a>)
                    }
                    {this.state.activeSlideIndex < this.props.stories.length - 1
                    && (<a className="slide-arrow next"
                           onClick={this.next}
                    > </a>)
                    }
                  </article>
                </div>
              </div>
              <div className="fullstory-navs fullstory-navs-md">
                <div className="col">
                  {this.state.activeSlideIndex > 0
                  &&
                  (<div><h5><a onClick={this.prev} className="prev">Previous Badge</a></h5>
                    <h4><a onClick={this.prev}>{this.state.prevStory.badgeType.name}</a></h4></div>)
                  }
                </div>
                <div className="col col-btn show-md">
                  <div className="action"><a className="btn btn-more btn-md">Load More Badges</a></div>
                </div>
                <div className="col">
                  {this.state.activeSlideIndex < this.props.stories.length - 1
                  &&
                  (<div><h5><a onClick={this.next} className="next">Next Badge</a></h5>
                    <h4><a onClick={this.next}>{this.state.nextStory.badgeType.name}</a></h4></div>)
                  }
                </div>
              </div>
            </div>
          )
        }
      
      </div>
    )
  }
}

Badges.propTypes = {
  prop: PropTypes.object
}

export default Badges;
