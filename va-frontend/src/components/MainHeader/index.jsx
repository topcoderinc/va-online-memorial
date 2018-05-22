import React, {Component} from 'react';
import {NavLink, Link, Redirect} from 'react-router-dom';
import Toggler from '../../components/Toggler';
import SearchTable from '../../components/SearchTable';
import {Scrollbars} from 'react-custom-scrollbars';
import './styles.scss';
import AuthService from "../../services/auth";
import CommonService from "../../services/common";
import Spinner from '../Spinner';
import dataAction from '../../actions/dataAction';
import authAction from '../../actions/auth';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {extend, map, isEmpty} from 'lodash';

const mapStateToProps = (state) => {
  return extend({}, state.dataReducer);
};

class Masterhead extends Component {
  constructor(props) {
    super(props);
    this.$s = this.$s.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBirthDateChange = this.handleBirthDateChange.bind(this);
    this.handleDeathDateChange = this.handleDeathDateChange.bind(this);
    this.makeFilters = this.makeFilters.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
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
      showSpinner: false,
      isNotiPopupActive: false,
      redirectTo: null,
      // filters
      branchId: props.filters.branchIds || '0',
      squadronShip: props.filters.squadronShip || '',
      cemeteryId: props.filters.cemeteryId || '0',
      birthDateYear: props.filters.birthDateStart ? new Date(props.filters.birthDateStart).getFullYear() + '' : '',
      birthDateMonth: props.filters.birthDateStart ? new Date(props.filters.birthDateStart).getMonth() + 1 + '' : '',
      birthDateDay: props.filters.birthDateStart ? new Date(props.filters.birthDateStart).getDay() + '' : '',
      deathDateYear: props.filters.deathDateStart ? new Date(props.filters.deathDateStart).getFullYear() + '' : '',
      deathDateMonth: props.filters.deathDateStart ? new Date(props.filters.deathDateStart).getMonth() + 1 + '' : '',
      deathDateDay: props.filters.deathDateStart ? new Date(props.filters.deathDateStart).getDay() + '' : '',
      served: props.filters.served || '',
      division: props.filters.division || '',
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

  componentWillMount() {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      this.setState({ logger: currentUser });
      this.props.authAction.checkAuth(currentUser);
    }
    this.props.dataAction.getAllBranches();
    this.props.dataAction.getAllCemeteries();
    window.showLoginDialog = () => {
      this.setState({ isLoginActive: true, isRegisterActive: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.filters)) {
      this.setState({
        branchId: nextProps.filters.branchIds || '0',
        squadronShip: nextProps.filters.squadronShip || '',
        served: nextProps.filters.served || '',
        division: nextProps.filters.division || '',
        cemeteryId: nextProps.filters.cemeteryId || '0',
        birthDateYear: nextProps.filters.birthDateStart ? new Date(nextProps.filters.birthDateStart).getFullYear() + '' : '',
        birthDateMonth: nextProps.filters.birthDateStart ? new Date(nextProps.filters.birthDateStart).getMonth() + 1 + '' : '',
        birthDateDay: nextProps.filters.birthDateStart ? new Date(nextProps.filters.birthDateStart).getDate() + '' : '',
        deathDateYear: nextProps.filters.deathDateStart ? new Date(nextProps.filters.deathDateStart).getFullYear() + '' : '',
        deathDateMonth: nextProps.filters.deathDateStart ? new Date(nextProps.filters.deathDateStart).getMonth() + 1 + '' : '',
        deathDateDay: nextProps.filters.deathDateStart ? new Date(nextProps.filters.deathDateStart).getDate() + '' : '',
      });
    }
  }

  zeroFill(s) {
    if (s.length === 1) {
      return 0 + s;
    }
    return s;
  }

  makeFilters() {
    const birthDate = `${this.state.birthDateYear}-${this.zeroFill(this.state.birthDateMonth)}-${this.zeroFill(this.state.birthDateDay)}`;
    const deathDate = `${this.state.deathDateYear}-${this.zeroFill(this.state.deathDateMonth)}-${this.zeroFill(this.state.deathDateDay)}`;
    const reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;
    const regExp = new RegExp(reg);
    const filters = {
      name: this.state.keyword.trim(),
      branchIds: this.state.branchId,
      squadronShip: this.state.squadronShip.trim(),
      cemeteryId: this.state.cemeteryId,
      division: this.state.division.trim(),
      served: this.state.served.trim(),
    };
    if (regExp.test(birthDate)) {
      filters.birthDateStart = birthDate;
      filters.birthDateEnd = birthDate;
    }
    if (regExp.test(deathDate)) {
      filters.deathDateStart = deathDate;
      filters.deathDateEnd = deathDate;
    }
    return filters;
  }

  // state update function
  handleChange(key, value) {
    const state = this.state;
    state[ key ] = value;
    state[ 'offset' ] = 0;
    this.setState(state, () => this.props.dataAction.searchVeterans(this.makeFilters()));
  }

  handleBirthDateChange(key, value) {
    const state = this.state;
    state[ key ] = value;
    state[ 'offset' ] = 0;
    this.setState(state, () => {
      const birthDate = `${this.state.birthDateYear}-${this.zeroFill(this.state.birthDateMonth)}-${this.zeroFill(this.state.birthDateDay)}`;
      const reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;
      const regExp = new RegExp(reg);
      if (regExp.test(birthDate)) {
        this.props.dataAction.searchVeterans(this.makeFilters());
      }
    });
  }

  handleDeathDateChange(key, value) {
    const state = this.state;
    state[ key ] = value;
    state[ 'offset' ] = 0;
    this.setState(state, () => {
      const deathDate = `${this.state.deathDateYear}-${this.zeroFill(this.state.deathDateMonth)}-${this.zeroFill(this.state.deathDateDay)}`;
      const reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
      const regExp = new RegExp(reg);
      if (regExp.test(deathDate)) {
        this.props.dataAction.searchVeterans(this.makeFilters());
      }
    });
  }

  // stopPropagation
  stopPropagation(event) {
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
    };

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
      this.setState({ showSpinner: true });
      AuthService.login({ email: user.value, password: pass.value }).then(user => {
        this.setState({
          logger: user,
          showSpinner: false,
          'isLoginActive': false
        });
        this.props.authAction.login(user);
      }).catch(err => {
        error.user = true;
        error.pass = true;
        this.setState({
          showSpinner: false,
          error: error
        });
        CommonService.showError(err);
      });
    }
  }

  /**
   * logout
   */
  logout() {
    AuthService.logout();
    this.props.authAction.logout();
    setTimeout(() => {
      this.setState({ logger: {}, redirectTo: '/' });
    }, 100);
  }

  /**
   * on register event
   */
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
    };

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
      const body = {
        email: registerEmail.value,
        password: registerPassConf.value,
        username: registerUser.value,
        firstName: '',
        lastName: '',
        mobile: '',
        gender: '',
      };
      // send request to backend
      this.setState({ showSpinner: true });
      AuthService.register(body).then((user) => {
        CommonService.showSuccess(`User with email ${user.email} register successful.`);
        this.setState({
          showSpinner: false,
          'isRegisterActive': false
        });
      }).catch(err => {
        this.setState({
          regerror: {
            showSpinner: false,
            registerEmail: true,
            registerUser: true,
          }
        });
        CommonService.showError(err);
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
    this.setState({ 'isLoginActive': false });
    this.setState({ 'isRegisterActive': false });
    this.setState({ 'isSearchFocused': true });

    document.addEventListener('click', this.handleOutsideClickHandler(this));
  }

  //hides searchpop
  hideSearchPopup() {
    this.setState({ 'isSearchFocused': false });
    if (document.querySelector('.search-modal')) {
      document.querySelector('.search-modal').removeEventListener('click', this.handleOutsideClick);
    }
  }

  // handleOutsideClick
  handleOutsideClickHandler(nodeEl) {
    return function (e) {
      // ignore clicks on the component itself
      if ((e.toElement || e.target).classList.contains('search-input')
        || (document.querySelector('.search-modal') && document.querySelector('.search-modal').contains(e.target))) {
        return;
      }
      nodeEl.hideSearchPopup();
    }
  }

  render() {
    const { notifications, addClass, userName } = this.props.attr;
    const { veterans, branches, cemeteries, nokRequests } = this.props;
    const nok = this.state.logger.role !== 'admin' && CommonService.isNok(nokRequests);
    const notiPopup = notifications && notifications.length > 0 &&
      (
        <div className="notification-popup">
          <h2>Notification</h2>
          <a className="close" onClick={this.$s({ isNotiPopupActive: false })}> </a>
          {
            notifications.map((n, i) => (
              <div key={i} className="notification-list-item">
                <div className="notification-group">
                  <span className={`notification-icon ${n.type}`}/>
                  <span className="notification-user">{n.user}</span>
                  <span> {n.action}</span>
                </div>
                <span className="notification-date">{n.date}</span>
              </div>
            ))
          }
        </div>
      );

    return (
      <div className={"main-header-page " + addClass}>
        {this.state.showSpinner && <Spinner/>}
        {this.state.redirectTo && <Redirect to={{ pathname: this.state.redirectTo }}/>}
        <div className="viewport">
          <NavLink to="/" className="logo"><strong>Veterans</strong><br className="title-line-breaker"/> <span>Legacy Memorial</span>
          </NavLink>
          <div className="search-bar">
            <input type="search" className="search-input"
                   placeholder="Find a veteran, search by veteran’s name"
                   value={this.state.keyword}
                   onClick={this.showSearchPopup}
                   onKeyPress={this.showSearchPopup}
                   autoComplete={'false'}
                   autoCapitalize={'false'}
                   autoCorrect={'false'}
                   onChange={(event) => this.handleChange('keyword', event.target.value)}
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
                  <span className="notification-wrap"
                        onClick={this.$s({ isNotiPopupActive: !this.state.isNotiPopupActive })}>
                    <a className="notification-link"> </a>
                    {
                      notifications && notifications.length > 0 &&
                      <span className="notification-num">{notifications.length}</span>
                    }
                    {
                      this.state.isNotiPopupActive && notifications && notifications.length > 0 &&
                      <div>
                        <span className="pa"/>
                        <div className="hide-md">
                          {notiPopup}
                        </div>
                      </div>
                    }
                  </span>
                  <div className="username">
                    <Link
                      to={this.state.logger.role === "admin" ? "/admin/setting" : "/setting"}>{this.state.logger.username || userName}
                      <span className="as-nok">{nok ? ' (as NOK)' : ''}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li><a onClick={this.logout}>Log out</a></li>
                    </ul>
                  </div>
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
              Forgot Password? <a><span className="hide-md inline">Click</span><span
              className="show-md inline">Tap</span> here</a>
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
                      <select className="selectctrl" value={this.state.branchId}
                              onChange={(event) => this.handleChange('branchId', event.target.value)}>
                        <option key="0" value="0">-Select-</option>
                        {
                          map(branches.items, item => {
                            return <option key={item.id} value={item.id}>{item.name}</option>
                          })
                        }
                      </select>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Date of Birth' }}>
                    <div className="toggler-con fx fields-3">
                      <div className="gr gr-1">
                        <h6>Month</h6>
                        <input type="text" value={this.state.birthDateMonth} className="textctrl mm"
                               onChange={(event) => this.handleBirthDateChange('birthDateMonth', event.target.value)}/>
                      </div>
                      <div className="gr gr-2">
                        <h6>Day</h6>
                        <input type="text" value={this.state.birthDateDay} className="textctrl dd"
                               onChange={(event) => this.handleBirthDateChange('birthDateDay', event.target.value)}/>
                      </div>
                      <div className="gr gr-3">
                        <h6>Year</h6>
                        <input type="text" value={this.state.birthDateYear} className="textctrl yy"
                               onChange={(event) => this.handleBirthDateChange('birthDateYear', event.target.value)}/>
                      </div>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Date of Death' }}>
                    <div className="toggler-con fx fields-3">
                      <div className="gr gr-1">
                        <h6>Month</h6>
                        <input type="text" value={this.state.deathDateMonth} className="textctrl mm"
                               onChange={(event) => this.handleDeathDateChange('deathDateMonth', event.target.value)}/>
                      </div>
                      <div className="gr gr-2">
                        <h6>Day</h6>
                        <input type="text" value={this.state.deathDateDay} className="textctrl dd"
                               onChange={(event) => this.handleDeathDateChange('deathDateDay', event.target.value)}/>
                      </div>
                      <div className="gr gr-3">
                        <h6>Year</h6>
                        <input type="text" value={this.state.deathDateYear} className="textctrl yy"
                               onChange={(event) => this.handleDeathDateChange('deathDateYear', event.target.value)}/>
                      </div>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Burial Location' }}>
                    <div className="toggler-con">
                      <select className="selectctrl" value={this.state.cemeteryId}
                              onChange={(event) => this.handleChange('cemeteryId', event.target.value)}>
                        <option key="0" value="0">-Select-</option>
                        {
                          map(cemeteries.items, item => {
                            return <option key={item.id} value={item.id}>{item.name}</option>
                          })
                        }
                      </select>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Location Served' }}>
                    <div className="toggler-con">
                      <input type="text" className="textctrl fluid" value={this.state.served}
                             onChange={(event) => this.handleChange('served', event.target.value)}/>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Division' }}>
                    <div className="toggler-con">
                      <input type="text" className="textctrl fluid" value={this.state.division}
                             onChange={(event) => this.handleChange('division', event.target.value)}/>
                    </div>
                  </Toggler>

                  <Toggler attr={{ title: 'Squadron / Ship' }}>
                    <div className="toggler-con">
                      <input type="text" value={this.state.squadronShip} className="textctrl fluid"
                             onChange={(event) => this.handleChange('squadronShip', event.target.value)}/>
                    </div>
                  </Toggler>


                </div>
                <div className="col col-result">
                  {veterans.items && veterans.items.length > 0
                    ? (<div>
                        <h3><span className="count"> {veterans.total} </span> Results for <span
                          className='keyword'>“{this.state.keyword}”</span></h3>
                        <SearchTable attr={{
                          keyword: this.state.keyword, searchedResults: veterans.items,
                          limit: this.props.filters.limit || 10,
                          total: veterans.total,
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

const matchDispatchToProps = (dispatch) => {
  return {
    dataAction: bindActionCreators(extend({}, dataAction), dispatch),
    authAction: bindActionCreators(extend({}, authAction), dispatch),
  };
};

export default connect(mapStateToProps, matchDispatchToProps)(Masterhead);
