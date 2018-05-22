import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import CommonService from "../../services/common";
import APIService from "../../services/api";

class Stories extends Component {
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
    this.type = 'Story';
  }
  
  componentDidMount() {
    this.setState({
      prevStory: this.props.stories[ 1 ],
      nextStory: this.props.stories[ 3 ]
    });
  }
  
  /**
   * set activity story
   * @param index
   */
  setActiveStory(index) {
    this.setState({
      activeStory: this.props.stories[ index ],
      activeSlideIndex: index,
      saluted: false,
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
      <div className="collection-list-wrap">
        <h3 className="title">Stories of {profileName}</h3>
        <span className="opts">
          <a className="btn btn-rt-2 btn-search"> </a>
          <a className="btn btn-rt-1 btn-story"><span className="tx">Write Story</span> </a>
        </span>
        
        {!this.state.activeStory
          ? (
            <div>
              <div className="viewport st-collection-view">
                {stories.map((item, i) => {
                  return (
                    <div key={i} className="st-collection-item-card-wrap">
                      <div className="collection-item-card">
                        <h5>{item.title}</h5>
                        <div className="desc">{item.text}</div>
                        <div className="more"
                             onClick={() => { this.setActiveStory(i) }}
                        ><a>Read more</a></div>
                      </div>
                      <div className="caption">Story
                        by <strong>{item.createdBy.username}</strong></div>
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
                       onClick={() => this.props.fetchStories(this.props.offset + this.props.limit)}>Load More
                      Stories</a>
                  </div>
                  : <div className={"space"}/>
              }
            </div>
          )
          : (
            <div className="viewport fullstory-view">
              <div className="fullstory-slide">
                <div className="fullstory-card">
                  <div className="postedby">Story by <strong>{activeStory.createdBy.username}</strong></div>
                  <div className="dateval">{CommonService.getCreateTime(activeStory)}</div>
                  <a className="close"
                     onClick={this.clearActiveStory}
                  > </a>
                  <a className="flag" onClick={() => window.showProfileFlagPopUp('Story', activeStory.id)}> </a>
                  
                  <article className="article">
                    <h3>{activeStory.title}</h3>
                    <div className="fullstory"
                         dangerouslySetInnerHTML={{ __html: this.state.activeStory.text }}
                    />
                    
                    <footer className="article-footer">
                      <div className="col col-meta">
                        <div className="meta-gr">
                          <h6>Reads</h6>
                          <div className="meta-val reads">
                            {'1,333'}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Salutes</h6>
                          <div className="meta-val salutes">
                            {'489'}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Shares</h6>
                          <div className="meta-val shares">
                            {'269'}
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
                  (<div><h5><a onClick={this.prev} className="prev">Previous Story</a></h5>
                    <h4><a onClick={this.prev}>{this.state.prevStory.title}</a></h4></div>)
                  }
                </div>
                <div className="col col-btn show-md">
                  <div className="action"><a className="btn btn-more btn-md">Load More Storys</a></div>
                </div>
                <div className="col">
                  {this.state.activeSlideIndex < this.props.stories.length - 1
                  &&
                  (<div><h5><a onClick={this.next} className="next">Next Story</a></h5>
                    <h4><a onClick={this.next}>{this.state.nextStory.title}</a></h4></div>)
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

Stories.propTypes = {
  prop: PropTypes.object
}

export default Stories;
