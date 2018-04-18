import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Scrollbars } from 'react-custom-scrollbars';
import './profile-card.scss';

class ProfileCard extends Component {
  constructor(props) {
    super(props);

    this.togglePopup = this.togglePopup.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.hideAllPopup = this.hideAllPopup.bind(this);
    this.toggleBadgeSelect = this.toggleBadgeSelect.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.resetPopup = this.resetPopup.bind(this);

    this.state = {
      isTimelineEvents: false,
      activePop: '',
      popupActive: '',
      files: [],
      nokError: {},
      activeFlagId: 1
    };
  }
  

  componentDidMount(){
    this.setState({
      badgeOpts: !!this.props.attr ? this.props.attr.badgeOpts: []
    });
  }

  // flie drop handler
  onDrop(files){
    this.setState({
      files
    });
  }

  //toggleBadgeSelect
  toggleBadgeSelect(index){
    // this.state.badgeOpts, 
    let clonedBadges = this.state.badgeOpts.concat();
    clonedBadges[index].isSelected = !clonedBadges[index].isSelected;
    this.setState({
      badgeOpts: clonedBadges
    })
  }

  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }

    this.togglePopup(this.state.activePop)();
  }

  // renderThumb
  renderThumb({ style, ...props }){
    const thumbStyle = {
      backgroundColor: `rgb(0,0,0)`,
      width: `6px`,
      borderRadius: `10px`
    };

    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props} />
    )
  }

// hidePopup
  hidePopup(){
    const activePop = this.state.activePop;
    let popState = {};
    popState[activePop] = false;
    this.setState(popState);
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.setState({ 'activePop': '' });
  }

  hideAllPopup(){
    let newState = {};
    newState.popupActive = '';
    this.setState(newState);
    document.querySelector('body').classList.remove('has-popup');

    this.resetPopup();
  }

  resetPopup(){
    this.refs.photoCaption.value = "";
    this.setState({'files':[]});
  }

  stopPropagation(e){
    e.stopPropagation();
  }

  showPopup(popupName) {
    return (() => {
      this.hidePopup();
      let newState = {};
      newState.popupActive = popupName;
      this.setState(newState);
      document.querySelector('body').classList.add('has-popup');
    })
  }

  togglePopup(popName) {

    return((e)=>{
      if (!this.state[popName]){
        this.setState({ 'activePop': popName});
        document.addEventListener('click', this.handleOutsideClick, false);
      } else {
        this.setState({ 'activePop': '' });
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
      
      this.setState(prevState => {
        let newState = {};
        newState[popName] = !prevState[popName];
          return (newState);
        }
      )
    })
    
  }

  sendRequest(){
    let nokFullName = this.refs.nokFullName;
    let nokEmail = this.refs.nokEmail;
    let error = {
      nokFullName: false,
      nokEmail: false
    };
    let isValid = true;
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

    if(!nokFullName.value){
      error.nokFullName = true;
      isValid = false;
    }
    if (!nokEmail.value || !nokEmail.value.match(pattern)){
      error.nokEmail = true;
      isValid = false;
    }


    this.setState({
      nokError: { ...error }
    })
    
    if (isValid){
      nokFullName.value = '';
      nokEmail.value = '';
      this.showPopup('isFlagginPopup')();
    }
  }

  render() {
    const $p = !!this.props.attr ? this.props.attr : {};

    return (
      <div className="profile-card">
        <div className="bar-quotes-n-activity-wrap">
          <div className="viewport">
            <div className="bar-quotes-n-activity">
              <div className="col">
                <div className="lead-msg">
                  <i className="ico-flower"></i>

                  <h5>{$p.msgTitle}</h5>
                  <div className="desc">{$p.msgDescription} <a>Read more</a></div>
                </div>
              </div>
              <div className="col col-opts">
                <a className="btn btn-story"
                  onClick={this.showPopup('isWritePop')}
                ><span className="tx">Write Story</span> </a>
                <a className="btn btn-upload"
                  onClick={this.showPopup('isUploadPop')}><span className="tx">Upload</span> </a>
                <a className="btn btn-test"
                  onClick={this.showPopup('isTestimonialPop')}><span className="tx">Testimonial</span> </a>
                <a className="btn btn-badge"
                  onClick={this.showPopup('isBadgePop')}><span className="tx">Badge</span> </a>
              </div>
              </div>
          </div>
        </div>

        <div className="profile-details-wrap">
          <div className="viewport">
            <div className="profile-details">
              <div className="profile-picture">
                <img src={$p.profileImgSrc} alt=""/>
                <a className="lnk send-request-lnk"
                  onClick={this.showPopup('isNokPopup')}
                >Send NOK Request</a>
              </div>
              <div className="bar-basicinfo">
                <div className="col col-name">
                  <h3>{$p.profileName}</h3> 
                  <div className="meta">{$p.life}</div>
                </div>
                <div className="col col-opts align-r">
                  <div className="row">
                  <a className="btn btn-send-report"
                      onClick={this.togglePopup('isTimelineEvents')}
                  >View Timeline</a> 
                  </div>
                  <div className="row st show-md">
                    <a className="lnk send-request-lnk"
                      onClick={this.showPopup('isNokPopup')}
                    >Send NOK Request</a>
                  </div>
                </div>
              
              </div>

              <div className="profile-more-details">
                <div className="fieldset">
                  <h6>Buried At</h6>
                  <div className="val">{$p.burriedAt}</div>  
                </div>
                <div className="fieldset">
                    <h6>Burial Location</h6>
                  <div className="val"><a className="lnk"
                    onClick={this.showPopup('isFlagginPopup')}
                  >{$p.burrialLoc}</a></div>  
                </div>
                <div className="fieldset">
                      <h6>War</h6>
                  <div className="val">{$p.war}</div>  
                </div>
                <div className="fieldset">
                  <h6>Branch of Service</h6>
                  <div className="val">{$p.branch}</div>  
                </div>
                <div className="fieldset">
                  <h6>Rank</h6>
                  <div className="val">{$p.rank}</div>  
                </div>
                <div className="fieldset">
                  <h6>Campaign</h6>
                  <div className="val">{$p.campaign}</div>  
                </div>
              </div>
              
            </div> 

            <div className={"timeline-popup " + (this.state.isTimelineEvents ? 'on' : '')}
              ref={node => { this.node = node; }}
            >
            
              <h2>{$p.profileName}</h2>
              <span className="pa"></span>
              <div className="tagline">Timeline Event</div>
              <div className="timeline-event-list">
                <a className="close" 
                  onClick={this.hidePopup}
                > </a>
                <table className="event-table">
                  <tbody>
                    <tr>
                      <th>Timeline</th>
                      <th>Event</th>
                    </tr>
                    {
                      
                      !!$p.timelineEvents && $p.timelineEvents.map((item,i)=>{
                        return(
                          <tr key={i}>
                            <td>{item.postedDate}</td>
                            <td><span className={'event ' + item.event.toLowerCase()}>{item.event}</span></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                <div className="action">
                    <a className="btn btn-event"
                      onClick={this.showPopup('isEventPop')}
                    ><span className="ico">Event</span> </a> 
                </div>
              </div>

            </div>
          </div>
        </div>
       
        <div className={"popup-wrap " + (this.state.popupActive === 'isWritePop' ? 'on' : '')}
          onClick={this.hideAllPopup}>
            <div className="popup"
            onClick={this.stopPropagation}
            >
              <header className="type-story">Write Story</header>
              <a className="close"
                onClick={this.hideAllPopup}
              > </a>
              <form className="frm">
                <div className="fieldset">
                  <h6>Title</h6>
                  <div className="val">
                    <input type="text" className="textctrl" />
                  </div>
                </div>
                <div className="fieldset">
                  <h6>Message</h6>
                  <div className="val">
                    <textarea className="textarea textctrl"></textarea>
                  </div>
                </div>
                <div className="actions fx">
                  <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                  >Cancel</a>
                  <a className="btn"
                   onClick={this.hideAllPopup}
                  >Post Story</a>
                </div>
              </form>
            </div>
          </div>

       
        <div className={"popup-wrap " + (this.state.popupActive === 'isFlagginPopup' ? 'on' : '')}
          onClick={this.hideAllPopup}>
            <div className="popup"
            onClick={this.stopPropagation}
            >
            <header>Why are you flagging this?</header>
              <a className="close"
                onClick={this.hideAllPopup}
              > </a>
              <form className="frm">
                {
                  $p.flaggingOpts && $p.flaggingOpts.map( (item, i)=> {
                  return (
                    <div key={i} className={"fieldset fieldset-opt "}
                    >
                      <a className={"radioctrl "
                        + (this.state.activeFlagId === item.id ? 'checked' : '')}
                        onClick={() => { this.setState({ activeFlagId: item.id }) }}
                      >{item.reason}</a>
                      <div className="details hide-md">{item.details}</div>
                      </div>
                    )
                  })
                }
                <div className="disclosure">Flagged content may in violation of the Veterans Legacy Memorial User Agreement, and will be reviewed and evaluated by an administrator.</div>
                <div className="actions fx spaced-lg">
                  <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                  >Cancel</a>
                  <a className="btn btn-md"
                  onClick={this.showPopup('isThanksPop')}
                  >Submit Report</a>
                </div>
              </form>
            </div>
          </div>
        
        
        
        
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isUploadPop' ? 'on' : '')}
          onClick={this.hideAllPopup}
          ref={node => { this.nodeStory = node; }}>
          <div className="popup"
            onClick={this.stopPropagation}
          >
            <header className="type-photo">Upload Photo</header>
            <a className="close"
              onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset">
                <h6>Photo Caption</h6>
                <div className="val">
                  <input type="text" className="textctrl" ref="photoCaption" />
                </div>
              </div>
              <div className="fieldset">
                <h6>Upload Photo</h6>
                <div className="val">
                  <div className="textarea textctrl">
                    <Dropzone className="dropzone" onDrop={this.onDrop.bind(this)}>
                      <div className="drop-con hide-md">Drag and drop photo here or
                      <div className="spaced"><a className="btn btn-browse">Browse</a></div>
                        {
                          this.state.files.map(f => <div className="filename" key={f.name}>{f.name} - {f.size} bytes</div>)
                        }
                      </div>
                      <div className="drop-con show-md">Open phone album</div>

                      
                    </Dropzone>
                  </div>
                </div>
              </div>
              <div className="actions fx">
                <a className="btn btn-clear"
                  onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                  onClick={this.hideAllPopup}
                >Upload Photo</a>
              </div>
            </form>
          </div>
        </div>

        <div className={"popup-wrap " + (this.state.popupActive === 'isEventPop' ? 'on' : '')}
          onClick={this.hideAllPopup}
          ref={node => { this.nodeStory = node; }}>
          <div className="popup fluid-h"
            onClick={this.stopPropagation}
          >
            <header className="type-event">Add Event</header>
            <a className="close"
              onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset fieldset-date">
                <div className="field-gr mm">
                  <h6>Month</h6>
                  <div className="val">
                    <input type="text" className="textctrl" />
                  </div>
                </div>

                <div className="field-gr dd">
                  <h6>Day</h6>
                  <div className="val">
                    <input type="text" className="textctrl" />
                  </div>
                </div>
                
                <div className="field-gr yy">
                  <h6>Year</h6>
                  <div className="val">
                    <input type="text" className="textctrl" />
                  </div>
                </div>
              </div>
              
              <div className="fieldset">
                <h6>Event</h6>
                <div className="val">
                  <select className="selectctrl">
                    <option value="Select">-Select-</option>
                    <option value="Mock val">Birthday</option>
                    <option value="Mock val">High School Graduation</option>
                    <option value="Mock val">Enlistment Date</option>
                    <option value="Mock val">Deployment Date</option>
                    <option value="Mock val">Marriage</option>
                    <option value="Mock val">Divorce</option>
                    <option value="Mock val">Birth of Child</option>
                    <option value="Mock val">Death of Child</option>
                    <option value="Mock val">Associates Degree</option>
                    <option value="Mock val">Undergraduate Degree</option>
                    <option value="Mock val">Graduate Degree</option>
                    <option value="Mock val">Post-Graduate (Doctorate)</option>
                    <option value="Mock val">Moved</option>
                    <option value="Mock val">Died</option>
                    <option value="Mock val">Other</option>
                  </select>
                </div>
              </div>
              <div className="actions fx">
                <a className="btn btn-clear"
                  onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                  onClick={this.hideAllPopup}
                >Add Event</a>
              </div>
            </form>
          </div>
        </div>

        <div className={"popup-wrap " + (this.state.popupActive === 'isTestimonialPop' ? 'on' : '')}
          onClick={this.hideAllPopup}
          ref={node => { this.nodeStory = node; }}>
          <div className="popup"
            onClick={this.stopPropagation}
          >
            <header className="type-testimony">Write Testimonial</header>
            <a className="close"
              onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset">
                <h6>Title</h6>
                <div className="val">
                  <input type="text" className="textctrl" />
                </div>
              </div>
              <div className="fieldset">
                <h6>Testimonial</h6>
                <div className="val">
                  <textarea className="textarea textctrl"></textarea>
                </div>
              </div>
              <div className="actions fx">
                <a className="btn btn-clear"
                  onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn btn-md"
                  onClick={this.hideAllPopup}
                >Post Testimonial</a>
              </div>
            </form>
          </div>
        </div>

        <div className={"popup-wrap " + (this.state.popupActive === 'isBadgePop' ? 'on' : '')}
          onClick={this.hideAllPopup}
          ref={node => { this.nodeStory = node; }}>
          <div className="popup"
            onClick={this.stopPropagation}
          >
            <header className="type-badge">Add Badge</header>
            <a className="close"
              onClick={this.hideAllPopup}
            > </a>
            <form className="frm frm-badge">
              <div className="fieldset">
                <h6>Select Badge</h6>
                <div className="val">
                  <div className="badge-list-wrap">
                    <Scrollbars className="custom-scrollar scrollbar-md"
                       
                    >
                      <div className="badge-list">
                        {!!this.state.badgeOpts && this.state.badgeOpts.map((item,i)=>{
                          return (
                            <a key={i} className={"badge-el " + item.id + (!!item.isSelected ? ' on' : '')}
                              onClick={()=>{this.toggleBadgeSelect(i)}}
                            >{item.caption}</a>
                          )
                        })}
                      </div>
                    </Scrollbars>
                    
                  </div>
                </div>
              </div>
              
              <div className="actions fx">
                <a className="btn btn-clear"
                  onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                  onClick={this.hideAllPopup}
                >Add Badge</a>
              </div>
            </form>
          </div>
        </div>

        <div className={"popup-wrap " + (this.state.popupActive === 'isNokPopup' ? 'on' : '')}
          onClick={this.hideAllPopup}
          ref={node => { this.nodeStory = node; }}>
          <div className="popup"
            onClick={this.stopPropagation}
          >
            <header>Send a Next of Kin Request (NOK)</header>
            <a className="close"
              onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset">
                <h6>Veteran name</h6>
                <div className="val">
                  <div className="textctrl disabled">{$p.profileName}</div>
                </div>
              </div>
              <div className="fieldset">
                <h6>Full Name <span className="required" >(Required)</span></h6>
                <div className="val">
                  <input type="text" className={"textctrl " + (!!this.state.nokError.nokFullName ? 'error': '')} 
                    ref="nokFullName"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="fieldset">
                <h6>Your Email <span className="required" >(Required)</span></h6>
                <div className="val">
                  <input type="email" className={"textctrl " + (!!this.state.nokError.nokEmail ? 'error' : '')} 
                    ref="nokEmail"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="fieldset">
                <h6>Submit Proof</h6>
                <div className="val">
                  <Dropzone className="dropzone inline" onDrop={this.onDrop.bind(this)}>
                    <div className="drop-con">
                      <span className="filelist">{
                        this.state.files.length>0 
                          ? this.state.files.map(f => <span key={f.name} className="filename">{f.name}</span>)
                        : 'Upload file(s)'
                      }</span>

                      <a className="btn btn-browse">Browse</a>
                    </div>

                  </Dropzone>
                  
                </div>
              </div>

              <div className="banner-accepted">
                <h4>Accepted Proof</h4>
                <div className="info">{$p.acceptedProof}</div>
              </div>
              
              <div className="actions fx">
                <a className="btn btn-clear"
                  onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                  onClick={this.sendRequest}
                >Send Request</a>
              </div>
            </form>
          </div>
        </div>

        <div className={"popup-wrap " + (this.state.popupActive === 'isThanksPop' ? 'on' : '')}
          onClick={this.hideAllPopup}
          ref={node => { this.nodeStory = node; }}>
          <div className="popup popup-thanks"
            onClick={this.stopPropagation}
          >
            <div className="msg-thanks">
              <h3>Thank You!</h3>
              <p className="msg-text">Your post will be reviewed.</p>
              <div className="action">
                <a className="btn"
                  onClick={this.hideAllPopup}
                >OK</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      

    )
  }
}

ProfileCard.propTypes = {
  attr: PropTypes.object
}

export default ProfileCard;
