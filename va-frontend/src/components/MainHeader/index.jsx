import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Toggler from '../../components/Toggler';
import SearchTable from '../../components/SearchTable';
import { Scrollbars } from 'react-custom-scrollbars';
import './styles.scss';


class Masterhead extends Component {
  constructor(props) {
    super(props);
    this.$s = this.$s.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.showSearchPopup = this.showSearchPopup.bind(this);
    this.hideSearchPopup = this.hideSearchPopup.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);

    this.state = {
      isLoginActive: false,
      isRegisterActive: false,
      keyword: '',
      isSearchFocused: false,
      logger: {},
      error: {},
      regerror: {},
      isNotiPopupActive: false,
    };
  }

  // state update function
  $s(attr, delay) {
    return () => {
      if (!!delay) {
        window.setTimeout(() => {
          this.setState({ ...attr });
        }, delay)
      } else {
        this.setState({ ...attr });
      }
    }
  }

  // state update function
  handleChange(event) {
    this.setState({ keyword: event.target.value });
  }

  // stopPropagation
  stopPropagation(event){
    event.stopPropagation();
  }

  // login
  login() {
    let user = this.refs.user;
    let pass = this.refs.pass;
    let isValid = true;

    let error = {
      user: false,
      pass: false
    }

    if (!user.value) {
      isValid = false;
      error.user = true;
    }
    if (!pass.value) {
      isValid = false;
      error.pass = true;
    }
    this.setState({
      error: error
    });

    if (isValid) {
      this.setState({
        logger: {
          username: user.value
        },
        'isLoginActive': false
      });
    }
  }

  // register
  register() {
    let registerEmail = this.refs.registerEmail;
    let registerPass = this.refs.registerPass;
    let registerPassConf = this.refs.registerPassConf;
    let registerUser = this.refs.registerUser;
    let isValid = true;

    let error = {
      registerEmail: false,
      registerPass: false,
      registerUser: false,
      registerPassConf: false
    }

    if (!registerEmail.value) {
      isValid = false;
      error.registerEmail = true;
    }
    if (!registerPass.value || registerPassConf.value !== registerPass.value) {
      isValid = false;
      error.registerPass = true;
    }
    if (!registerPassConf.value || registerPassConf.value !== registerPass.value) {
      isValid = false;
      error.registerPassConf = true;
    }
    if (!registerUser.value) {
      isValid = false;
      error.registerUser = true;
    }
    this.setState({
      regerror: error
    });

    if (isValid) {
      this.setState({
        'isRegisterActive': false
      });
    }
    
  }

  // renderThumb
  renderThumb({ style, ...props }) {
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

  //show searchpop
  showSearchPopup() {
    this.setState({'isLoginActive': false});
    this.setState({'isRegisterActive': false});
    this.setState({ 'isSearchFocused': true });

    document.addEventListener('click', this.handleOutsideClickHandler(this));
  }

  //hides searchpop
  hideSearchPopup() {
    this.setState({ 'isSearchFocused': false });
    document.querySelector('.search-modal').removeEventListener('click', this.handleOutsideClick);
  }


  // handleOutsideClick
  handleOutsideClickHandler(nodeEl) {
    return function (e) {
      // ignore clicks on the component itself
      if ((e.toElement || e.target).classList.contains('search-input') || document.querySelector('.search-modal').contains(e.target)) {
        return;
      }

      nodeEl.hideSearchPopup();
    }
  }

  render() {
    const { searchedResults, addClass, userName, notifications, nok } = { ...this.props.attr };

    const notiPopup = notifications && notifications.length > 0 &&
      (
        <div className="notification-popup">
          <h2>Notification</h2>
          <a className="close" onClick={this.$s({isNotiPopupActive: false})}> </a>
          {
            notifications.map((n,i)=>(
              <div key={i} className="notification-list-item">
                <div className="notification-group">
                  <span className={`notification-icon ${n.type}`}></span>
                  <span className="notification-user">{n.user}</span>
                  <span> {n.action}</span>
                </div>
                <span className="notification-date">{n.date}</span>
              </div>
            ))
          }
        </div>
      )

    return (
      <div className={"main-header-page " + addClass}>
        <div className="viewport">
          <NavLink to="/" className="logo"><strong>Veterans</strong><br className="title-line-breaker"/> <span>Legacy Memorial</span> </NavLink>
          <div className="search-bar">
            <input type="search" className="search-input"
              placeholder="Find a veteran, search by veteran’s name"
              value={this.state.keyword}
              onFocus={this.showSearchPopup}
              onKeyPress={this.showSearchPopup}
              onChange={this.handleChange}
            />
            <NavLink className="btn-search" to="/search"> </NavLink>
          </div>

          {
            (!this.state.logger.username && !userName)
              ? (
                <div className="actions">
                  <a className="btn btn-primary"
                    onClick={this.$s({ 'isLoginActive': true, 'isRegisterActive': false })}
                  >Login</a>
                  <a className="btn btn-clear"
                    onClick={this.$s({ 'isRegisterActive': true, 'isLoginActive': false })}
                  >Register</a>
                </div>
              )
              : (
                <div className="logger-area">
                  <span className="notification-wrap" onClick={this.$s({isNotiPopupActive: !this.state.isNotiPopupActive})}>
                    <a className="notification-link"> </a>
                    {
                      notifications && notifications.length > 0 &&
                      <span className="notification-num">{notifications.length}</span>
                    }
                    {
                      this.state.isNotiPopupActive && notifications && notifications.length > 0 &&
                      <div>
                        <span className="pa"></span>
                        <div className="hide-md">
                          {notiPopup}
                        </div>
                      </div>
                    }
                  </span>
                  <Link to="/setting" className="username">{this.state.logger.username || userName}<span className="as-nok">{nok ? ' (as NOK)' : ''}</span></Link>
                </div>
              )
          }

          {
            this.state.isNotiPopupActive && notifications && notifications.length > 0 &&
            <div className="show-md">
              {notiPopup}
            </div>
          }

          <div className={(this.state.isLoginActive ? 'open' : '') + ' header-card login-card '}>
            <h2>Login Account</h2>
            <a className="close"
              onClick={this.$s({ 'isLoginActive': false })}
            > </a>

            <div className="fieldset">
              <h5>Username or Email</h5>
              <div className="r-val">
                <input type="text" className={"textctrl " + (!!this.state.error.user ? 'error' : '')}
                  ref="user"
                />
              </div>
            </div>
            <div className="fieldset">
              <h5>Password</h5>
              <div className="r-val">
                <input type="password" className={"textctrl " + (!!this.state.error.pass ? 'error' : '')}
                  ref="pass"
                />
              </div>
            </div>
            <div className="fieldset alt">
              Forgot Password? <a><span className="hide-md inline">Click</span><span className="show-md inline">Tap</span> here</a>
            </div>

            <div className="action">
              <a className="btn fluid"
                onClick={this.login}
              >Login Account</a>
            </div>
          </div>

          <div className={(this.state.isRegisterActive ? 'open' : '') + ' header-card register-card '}>
            <h2>Create Account</h2>
            <a className="close"
              onClick={this.$s({ 'isRegisterActive': false })}
            > </a>

            <form className="frm">
              <div className="col col-createacc">
                <div className="fieldset">
                  <h5>Email</h5>
                  <div className="r-val">
                    <input type="email" 
                      className={"textctrl " + (!!this.state.regerror.registerEmail ? 'error' : '')}
                      ref="registerEmail"
                      />
                  </div>
                </div>
                <div className="fieldset">
                  <h5>Username</h5>
                  <div className="r-val">
                    <input type="text"
                      className={"textctrl " + (!!this.state.regerror.registerUser ? 'error' : '')}
                      ref="registerUser"
                    />
                  </div>
                </div>
                <div className="fieldset">
                  <h5>Password</h5>
                  <div className="r-val">
                    <input type="password" 
                      className={"textctrl " + (!!this.state.regerror.registerPass ? 'error' : '')}
                      ref="registerPass"
                    />
                  </div>
                </div>
                <div className="fieldset">
                  <h5>Re-enter Password</h5>
                  <div className="r-val">
                    <input type="password"
                      className={"textctrl " + (!!this.state.regerror.registerPassConf ? 'error' : '')}
                      ref="registerPassConf"
                    />
                  </div>
                </div>
              </div>

            </form>

            <div className="info-ribbon">
              You will have to verify your email address to use all the features.
            </div>

            <div className="action">
              <a className="btn"
                onClick={this.register}
              >Register Account</a>
            </div>
          </div>

          <div className={"search-modal " + (!!this.state.isSearchFocused ? 'on' : '')}
            onClick={this.hideSearchPopup}
          >
            <Scrollbars className="custom-scrollar scrollbar-md"
              renderThumbVertical={this.renderThumb}
            >
              <div className="inner"
                onClick={this.stopPropagation}
              > 
                <div className="col col-filter hide-md">
                  <h3>Filters</h3>

                  <Toggler attr={{
                    title: 'Branch of service',
                    isOpen: 'open'
                  }}>
                    <div className="toggler-con">
                      <select className="selectctrl">
                        <option value="Select">-Select-</option>
                        <option value="Mock val">United States Army</option>
                        <option value="Mock val">United States Navy</option>
                        <option value="Mock val">Unites States Marine Corps</option>
                        <option value="Mock val">United States Air Force</option>
                        <option value="Mock val">United States Coast Guard</option>
                        <option value="Mock val">Other</option>
                      </select>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Date of Birth' }}>
                    <div className="toggler-con fx fields-3">
                      <div className="gr gr-1">
                        <h6>Month</h6>
                        <input type="text" className="textctrl mm" />
                      </div>
                      <div className="gr gr-2">
                        <h6>Day</h6>
                        <input type="text" className="textctrl dd" />
                      </div>
                      <div className="gr gr-3">
                        <h6>Year</h6>
                        <input type="text" className="textctrl yy" />
                      </div>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Date of Death' }}>
                    <div className="toggler-con fx fields-3">
                      <div className="gr gr-1">
                        <h6>Month</h6>
                        <input type="text" className="textctrl mm" />
                      </div>
                      <div className="gr gr-2">
                        <h6>Day</h6>
                        <input type="text" className="textctrl dd" />
                      </div>
                      <div className="gr gr-3">
                        <h6>Year</h6>
                        <input type="text" className="textctrl yy" />
                      </div>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Burial Location' }}>
                    <div className="toggler-con">
                      <select className="selectctrl">
                        <option value="Select">-Select-</option>
                        <option value="Mock val">VA National Cemetery</option>
                        <option value="Mock val">State Cemetery</option>
                        <option value="Mock val">Territories and/or Tribal Government Cemetery</option>
                        <option value="Mock val">Private Cemetery</option>
                      </select>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Location Served' }}>
                    <div className="toggler-con">
                      <input type="text" className="textctrl fluid" />
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Division' }}>
                    <div className="toggler-con">
                      <input type="text" className="textctrl fluid" />
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Squadron / Ship' }}>
                    <div className="toggler-con">
                      <input type="text" className="textctrl fluid" />
                    </div>
                  </Toggler>


                </div>
                <div className="col col-result">
                  {!!this.state.keyword
                    ? (<div>
                        <h3><span className="count"> 268</span> Results for  <span className='keyword'>“{this.state.keyword}”</span></h3>
                          <SearchTable attr={{
                            keyword: this.state.keyword, searchedResults: searchedResults,
                            addClass: (!!this.state.keyword ? 'on' : '')
                          }}
                          />
                        </div>
                      )
                    : (<h3>Search Results</h3>)
                  }
                </div>
              </div>
            </Scrollbars>
           </div>
        </div>
      </div>
    );
  }
}

Masterhead.propTypes = {
  attr: PropTypes.object
}



export default Masterhead;
