import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import CommonService from "../../services/common";
import APIService from "../../services/api";

class Photos extends Component {
  constructor(props) {
    super(props);
    this.setActivePhoto = this.setActivePhoto.bind(this);
    this.clearActivePhoto = this.clearActivePhoto.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.setStoryNextPrevIndex = this.setStoryNextPrevIndex.bind(this);
    
    this.state = {
      activePhoto: '',
      prevPhoto: '',
      nextPhoto: '',
      saluted: false,
    };
    this.type = 'Photo';
  }
  
  componentDidMount() {
    this.setState({
      prevPhoto: this.props.photos[ 2 ],
      nextPhoto: this.props.photos[ 1 ]
    });
  }
  
  setActivePhoto(index) {
    this.setState({
      activePhoto: this.props.photos[ index ],
      activeSlideIndex: index
    });
    APIService.isSaluted(this.type, this.props.photos[ index ].id).then((rsp) => {
      this.setState({ saluted: rsp.saluted });
    });
    this.setStoryNextPrevIndex(index, this.props.photos.length);
  }
  
  /**
   * salute post
   */
  salutePost() {
    APIService.salutePost(this.type, this.state.activePhoto.id).then(() => {
      this.setState({ saluted: true });
      CommonService.showSuccess("Story salute successfully");
    }).catch(err => CommonService.showError(err));
  }
  
  /**
   * share post
   */
  sharePost() {
    APIService.sharePost(this.type, this.state.activePhoto.id).then(() => {
      this.setState({ saluted: true });
      CommonService.showSuccess("Story salute successfully");
    }).catch(err => CommonService.showError(err));
  }
  
  clearActivePhoto() {
    this.setState({
      activePhoto: ''
    });
  }
  
  next() {
    const len = this.props.photos.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex += 1;
    newIndex = Math.min(newIndex, len - 1);
    this.setStoryNextPrevIndex(newIndex, len);
  }
  
  prev() {
    const len = this.props.photos.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex -= 1;
    newIndex = Math.max(newIndex, 0);
    this.setStoryNextPrevIndex(newIndex, len);
  }
  
  setStoryNextPrevIndex(newIndex, len) {
    const prevIndex = Math.max(newIndex - 1, 0);
    const nextIndex = Math.min(newIndex + 1, len - 1);
    this.setState({
      activePhoto: this.props.photos[ newIndex ],
      activeSlideIndex: newIndex,
      prevPhoto: this.props.photos[ prevIndex ],
      nextPhoto: this.props.photos[ nextIndex ]
    });
  }
  
  render() {
    const stories = this.props.photos;
    const profileName = this.props.profileName;
    const activeStory = this.state.activePhoto;
    
    return (
      <div className="collection-list-wrap">
        <h3 className="title">Photos of {profileName}</h3>
        <span className="opts">
          <a className="btn btn-rt-2 btn-search"> </a>
          <a className="btn btn-rt-1 btn-upload"><span className="tx">Upload</span> </a>
        </span>
        
        {!this.state.activePhoto
          ? (
            <div>
              <div className="viewport ph-collection-view">
                {stories.map((item, i) => {
                  return (
                    <div key={i} className="ph-collection-item-card-wrap">
                      <div className="collection-item-card collection-photo"
                           onClick={() => { this.setActivePhoto(i) }}>
                        <div className="desc">
                          <img src={item.photoFile.fileURL} alt={`${item.title}`}/>
                        </div>
                      </div>
                      <div className="caption">Photo by <strong>{item.createdBy.username}</strong></div>
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
                       onClick={() => this.props.fetchPhotos(this.props.offset + this.props.limit)}>Load More
                      Photos</a>
                  </div>
                  : <div className={"space"}/>
              }
            </div>
          )
          : (
            <div className="viewport fullstory-view">
              <div className="fullstory-slide">
                <div className="fullstory-card">
                  <div className="postedby">Photo by <strong>{activeStory.createdBy.username}</strong></div>
                  <div className="dateval">{CommonService.getCreateTime(activeStory)}</div>
                  <a className="close"
                     onClick={this.clearActivePhoto}
                  > </a>
                  <a className="flag" onClick={() => window.showProfileFlagPopUp('Photo', activeStory.id)}>{''}</a>
                  
                  <article className="article">
                    <h3 className="sticky-md">{activeStory.title}</h3>
                    <div className="fullstory fullstory-photo">
                      <img src={activeStory.photoFile.fileURL} alt=""/>
                    </div>
                    
                    <footer className="article-footer">
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
                    {this.state.activeSlideIndex < this.props.photos.length - 1
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
                  (<div><h5><a onClick={this.prev} className="prev">Previous Photo</a></h5>
                    <h4><a onClick={this.prev}>{this.state.prevPhoto.title}</a></h4></div>)
                  }
                </div>
                <div className="col col-btn show-md">
                  <div className="action"><a className="btn btn-more btn-md">Load More Photos</a></div>
                </div>
                <div className="col">
                  {this.state.activeSlideIndex < this.props.photos.length - 1
                  &&
                  (<div><h5><a onClick={this.next} className="next">Next Photo</a></h5>
                    <h4><a onClick={this.next}>{this.state.nextPhoto.title}</a></h4></div>)
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

Photos.propTypes = {
  prop: PropTypes.object
}

export default Photos;
