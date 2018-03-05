import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class Testimonials extends Component{
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
      nextStory: ''
    }
  }

  componentDidMount(){
    this.setState({
      prevStory: this.props.stories[1],
      nextStory: this.props.stories[3]
    });
  }

  setActiveStory(index) {
    this.setState({
      activeStory: this.props.stories[index],
      activeSlideIndex: index
    });
    this.setStoryNextPrevIndex(index, this.props.stories.length);
  }

  clearActiveStory(){
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
      activeStory: this.props.stories[newIndex],
      activeSlideIndex: newIndex,
      prevStory: this.props.stories[prevIndex],
      nextStory: this.props.stories[nextIndex]
    });
  }

  render(){
    const stories = this.props.stories;
    const profileName = this.props.profileName;
    const activeStory = this.state.activeStory;
  
    return (
      <div className="collection-list-wrap">
        <h3 className="title">Testimonials for {profileName}</h3>
        <span className="opts">
          <a className="btn btn-rt-2 btn-search"> </a>
          <a className="btn btn-rt-1 btn-test"><span className="tx">Testimonial</span> </a>
        </span>
        
        
        {!this.state.activeStory
        ?(
            <div>
            <div className="viewport collection-view">
              {stories.map((item, i) => {
                return (
                  <div key={i} className="collection-item-card-wrap">
                    <div className="collection-item-card  con-centered">
                      <h5>{item.title}</h5>
                      <div className="desc">{item.story}</div>
                      <div className="more"
                        onClick={() => { this.setActiveStory(i) }}
                      ><a>Read more</a></div>
                    </div>
                    <div className="caption">Story by <strong>{item.author}</strong></div>
                    <div className="date">{item.date}</div>
                  </div>
                )
              })
              }
            </div>

              <div className="action"><a className="btn btn-more btn-md">Load More Testimonials</a></div>
            </div>
        )
        :(
          <div className="viewport fullstory-view">
            <div className="fullstory-slide">
                <div className="fullstory-card fullstory-card-md">
                  <div className="postedby">Testimonials by <strong>{activeStory.author}</strong></div>
                  <div className="dateval">{activeStory.date}</div>
                  <a className="close"
                    onClick={this.clearActiveStory}
                  > </a>
                  <a className="flag"> </a>

                  <article className="article centered">
                    <h3>{activeStory.title}</h3>
                    <div className="fullstory" 
                      dangerouslySetInnerHTML={{ __html: this.state.activeStory.fullStory }}
                    ></div>

                    <footer className="article-footer alt">
                      <div className="col col-meta">
                        <div className="meta-gr">
                          <h6>Views</h6>
                          <div className="meta-val reads">
                            {activeStory.reads}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Salutes</h6>
                          <div className="meta-val salutes">
                            {activeStory.salutes}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Shares</h6>
                          <div className="meta-val shares">
                            {activeStory.shares}
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <a className="btn btn-salute">Salute</a>
                        <a className="btn btn-share">Share</a>
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
                  (<div><h5><a onClick={this.prev} className="prev">Previous Testimonial</a></h5>
                    <h4><a onClick={this.prev}>{this.state.prevStory.title}</a></h4></div>)
                }
              </div>
              <div className="col col-btn show-md">
                  <div className="action"><a className="btn btn-more btn-md">Load More Testimonials</a></div>
              </div>
              <div className="col">
                {this.state.activeSlideIndex < this.props.stories.length - 1
                  &&
                    (<div><h5><a onClick={this.next} className="next">Next Testimonial</a></h5>
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

Testimonials.propTypes = {
  prop: PropTypes.object
}

export default Testimonials;
