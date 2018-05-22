import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import CommonService from "../../services/common";
import APIService from "../../services/api";

class Testimonials extends Component {
  constructor(props) {
    super(props);
    this.setActiveTest = this.setActiveTest.bind(this);
    this.clearActiveTest = this.clearActiveTest.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setTestNextPrevIndex = this.setTestNextPrevIndex.bind(this);
    
    this.state = {
      activeTest: '',
      prevTest: '',
      nextTest: '',
      saluted: false,
    };
    this.type = 'Testimonial';
  }
  
  componentDidMount() {
    this.setState({
      prevTest: this.props.tests[ 1 ],
      nextTest: this.props.tests[ 3 ]
    });
  }
  
  setActiveTest(index) {
    this.setState({
      activeTest: this.props.tests[ index ],
      activeSlideIndex: index
    });
    APIService.isSaluted(this.type, this.props.tests[ index ].id).then((rsp) => {
      this.setState({ saluted: rsp.saluted });
    });
    this.setTestNextPrevIndex(index, this.props.tests.length);
  }
  
  /**
   * salute post
   */
  salutePost() {
    APIService.salutePost(this.type, this.state.activeTest.id).then(() => {
      this.setState({ saluted: true });
      CommonService.showSuccess("Story salute successfully");
    }).catch(err => CommonService.showError(err));
  }
  
  /**
   * share post
   */
  sharePost() {
    APIService.sharePost(this.type, this.state.activeTest.id).then(() => {
      this.setState({ saluted: true });
      CommonService.showSuccess("Story salute successfully");
    }).catch(err => CommonService.showError(err));
  }
  
  clearActiveTest() {
    this.setState({
      activeTest: ''
    });
  }
  
  next() {
    const len = this.props.tests.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex += 1;
    newIndex = Math.min(newIndex, len - 1);
    this.setTestNextPrevIndex(newIndex, len);
  }
  
  prev() {
    const len = this.props.tests.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex -= 1;
    newIndex = Math.max(newIndex, 0);
    this.setTestNextPrevIndex(newIndex, len);
  }
  
  setTestNextPrevIndex(newIndex, len) {
    const prevIndex = Math.max(newIndex - 1, 0);
    const nextIndex = Math.min(newIndex + 1, len - 1);
    this.setState({
      activeTest: this.props.tests[ newIndex ],
      activeSlideIndex: newIndex,
      prevTest: this.props.tests[ prevIndex ],
      nextTest: this.props.tests[ nextIndex ]
    });
  }
  
  render() {
    const tests = this.props.tests;
    const profileName = this.props.profileName;
    const activeTest = this.state.activeTest;
    
    return (
      <div className="collection-list-wrap">
        <h3 className="title">Testimonials for {profileName}</h3>
        <span className="opts">
          <a className="btn btn-rt-2 btn-search"> </a>
          <a className="btn btn-rt-1 btn-test"><span className="tx"><span
            className="show-md">Write</span> Testimonial</span> </a>
        </span>
        
        
        {!this.state.activeTest
          ? (
            <div>
              <div className="viewport tt-collection-view">
                {tests.map((item, i) => {
                  return (
                    <div key={i} className="tt-collection-item-card-wrap">
                      <div className="collection-item-card  con-centered">
                        <h5>{item.title}</h5>
                        <div className="desc">{item.text}</div>
                        <div className="more"
                             onClick={() => { this.setActiveTest(i) }}
                        ><a>Read more</a></div>
                      </div>
                      <div className="caption">Story by <strong>{item.createdBy.username}</strong></div>
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
                       onClick={() => this.props.fetchTestimonials(this.props.offset + this.props.limit)}>Load More
                      Testimonials</a>
                  </div>
                  : <div className={"space"}/>
              }
            </div>
          )
          : (
            <div className="viewport fullstory-view">
              <div className="fullstory-slide">
                <div className="fullstory-card fullstory-card-md">
                  <div className="postedby">Testimonials by <strong>{activeTest.createdBy.username}</strong></div>
                  <div className="dateval">{CommonService.getCreateTime(activeTest)}</div>
                  <a className="close"
                     onClick={this.clearActiveTest}
                  > </a>
                  <a className="flag" onClick={() => window.showProfileFlagPopUp('Testimonial', activeTest.id)}>{''}</a>
                  
                  <article className="article centered">
                    <h3>{activeTest.title}</h3>
                    <div className="fullstory"
                         dangerouslySetInnerHTML={{ __html: this.state.activeTest.text }}
                    />
                    
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
                    {this.state.activeSlideIndex < this.props.tests.length - 1
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
                  (<div><h5><a onClick={this.prev} className="prev">Previous Testimonial</a></h5>
                    <h4><a onClick={this.prev}>{this.state.prevPhoto.title}</a></h4></div>)
                  }
                </div>
                <div className="col col-btn show-md">
                  <div className="action"><a className="btn btn-more btn-md">Load More Testimonials</a></div>
                </div>
                <div className="col">
                  {this.state.activeSlideIndex < this.props.tests.length - 1
                  &&
                  (<div><h5><a onClick={this.next} className="next">Next Testimonial</a></h5>
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

Testimonials.propTypes = {
  prop: PropTypes.object
}

export default Testimonials;
