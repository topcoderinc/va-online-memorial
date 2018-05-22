import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {map, get} from 'lodash';
import dataAction from '../../actions/dataAction';
import actions from '../../actions/auth';
import MainHeaderComponent from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import CascadeMenu from '../../components/CascadeMenu';
import SettingBasicDetails from '../../components/SettingBasicDetails';
import SettingRequest from '../../components/SettingRequest';
import SettingPreferences from '../../components/SettingPreferences';
import SettingPosts from '../../components/SettingPosts';
import AdminPosts from '../../components/AdminPosts';
import AdminRequest from '../../components/AdminRequest';
import AdminUsers from '../../components/AdminUsers';
import {NavLink, Redirect} from 'react-router-dom';
import {VETERAN_NAME_LIMIT, DEFAULT_PROFILE_DATA} from "../../config";
import AuthService from "../../services/auth";
import './setting.scss';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: props.admin ? 'Flagged Posts' : 'Basic Details',
    };
    this.updateBaseProfile = this.updateBaseProfile.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.updatePreferences = this.updatePreferences.bind(this);
    this.deleteNokRequest = this.deleteNokRequest.bind(this);
    this.createNokRequest = this.createNokRequest.bind(this);
    this.approvePost = this.approvePost.bind(this);
    this.declinePost = this.declinePost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.declineRequest = this.declineRequest.bind(this);
    this.approveRequest = this.approveRequest.bind(this);
    this.deleteFlag = this.deleteFlag.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentWillMount() {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      this.props.actions.checkAuth(currentUser);
      this.props.dataAction.getData();
      if (currentUser.role !== 'admin') {
        this.props.dataAction.getPreferences();
        this.props.dataAction.getNOKRequests({ userId: currentUser.id });
        this.props.dataAction.getMyPosts();
        this.props.dataAction.getReviewPosts();
        this.props.dataAction.getVeteransName({ limit: VETERAN_NAME_LIMIT });
      } else {
        this.props.dataAction.getNOKReviewRequests({ status: 'Requested' });
        this.props.dataAction.getNOKArchivedRequests({ status: 'Approved' });
        this.props.dataAction.getFlags();
      }
    }
  }

  activateMenu = (menu) => {
    if (menu !== this.state.activeMenu) {
      this.setState({
        activeMenu: menu,
        showMenu: false,
      })
    }
  };

  toggleMenu = show => {
    this.setState({
      showMenu: !this.state.showMenu,
    })
  };

  updateBaseProfile(profile) {
    this.props.actions.updateProfile(this.props.user.id, profile);
  }

  /**
   * deactive account
   */
  deactivate() {
    this.props.actions.deactivate();
  }

  /**
   * update user setting
   * @param preferences the setting
   */
  updatePreferences(preferences) {
    this.props.dataAction.updatePreferences(preferences);
  }

  /**
   * delete request
   * @param id the request id
   */
  deleteNokRequest(id) {
    this.props.dataAction.deleteNOKRequest(this.props.user.id, id);
  }

  /**
   * create nok request
   * @param files the reqest files
   * @param veteranId the veteran id
   */
  createNokRequest(files, veteranId) {
    const { user } = this.props;
    this.props.dataAction.createNextOfKin(files, user.id, veteranId, user.username, user.email);
  }

  updatePost() {
    const currentUser = AuthService.getCurrentUser();
    this.props.dataAction.getMyPosts({ userId: currentUser.id, status: 'Requested' });
    this.props.dataAction.getReviewPosts({ status: 'Requested', review: true });
  }

  /**
   * approve post by id
   * @param id the post id
   */
  approvePost(id) {
    this.props.dataAction.approvePost(id);
  }

  /**
   * decline post by id
   * @param id the post id
   */
  declinePost(id) {
    this.props.dataAction.declinePost(id);
  }

  /**
   * delete post by id
   * @param id the post id
   */
  deletePost(id) {
    this.props.dataAction.deletePost('Story', id);
  }

  /**
   * decline request by id
   * @param id the post id
   */
  declineRequest(id) {
    this.props.dataAction.deleteNOKRequest(id);
  }

  /**
   * approve request by id
   * @param id the post id
   */
  approveRequest(id) {
    this.props.dataAction.approveRequest(id);
  }

  /**
   * download file
   */
  downloadFile(file) {
    this.props.dataAction.downloadFile(file);
  }

  /**
   * delete flag
   * @param flagId the flag id
   * @param type the flag type
   * @param id the content id
   */
  deleteFlag(flagId, type, id) {
    this.props.dataAction.deleteFlag(flagId, type, id);
  }

  render() {
    const { admin, db, user, settingPreferences, nokRequests, veteranNames, myPosts, reviewPosts, archivedRequests, reviewRequests, flagged } = this.props;

    const { footerLinks, feedback, faqs, notifications, adminUsers } = db;

    const profileMenu = {
      title: 'Profile',
      submenus: map([ 'Basic Details', 'NOK Request', 'Notification Preferences' ],
        t => ({ id: t, title: t, onClick: () => this.activateMenu(t) }))
    };

    const postsMenu = {
      title: 'Posts',
      submenus: [
        {
          id: 'For Review',
          title: `For Review (${reviewPosts.total || 0})`,
          onClick: () => this.activateMenu('For Review')
        },
        { id: 'By You', title: `By You (${myPosts.total || 0})`, onClick: () => this.activateMenu('By You') },
      ]
    };

    const adminPostsMenu = {
      title: 'Posts',
      submenus: [
        { id: 'Flagged Posts', title: 'Flagged', onClick: () => this.activateMenu('Flagged Posts') },
        { id: 'Removed Posts', title: 'Removed', onClick: () => this.activateMenu('Removed Posts') },
      ]
    };

    const adminRequestMenu = {
      title: 'NOK Request',
      submenus: [
        { id: 'Request For Review', title: 'For Review', onClick: () => this.activateMenu('Request For Review') },
        { id: 'Archived Request', title: 'Archived', onClick: () => this.activateMenu('Archived Request') },
      ]
    };

    const adminUsersMenu = {
      title: 'Users',
      submenus: [
        { id: 'Usage Dashboard', title: 'Usage Dashboard', onClick: () => this.activateMenu('Usage Dashboard') },
        { id: 'Joined This Month', title: 'Joined This Month', onClick: () => this.activateMenu('Joined This Month') },
      ]
    };

    const { activeMenu, showMenu } = this.state;

    return (
      <div className="page-wrapper setting-page">

        {!AuthService.getCurrentUser() && <Redirect to={'/'}/>}
        <MainHeaderComponent attr={ { userName: user ? user.username : '', notifications: notifications, nok: nokRequests} } />
          <main className="main">
          <div className="welcome-banner">
            <div className="viewport">
              <div
                className="welcome-title">{admin ? `Welcome, ${user ? user.username : ''}` : 'Hi There, Welcome to your Profile'}</div>
              {
                admin ?
                  (<div>View your dashboard, accept user registrations, NOK Requests and posts that have been marked as
                    Flagged</div>) :
                  (<div className="welcome-content">From here you can update your win profile, manage Next of Kin
                    Requests and view your preferences.</div>)}
            </div>
          </div>
          <div className="viewport setting-viewport">
            {
              !admin &&
              <div className={`setting-sidebar ${showMenu ? 'sidebar-show-menu' : ''}`} onClick={this.toggleMenu}>
                <CascadeMenu
                  item={profileMenu}
                  activeIndex={map(profileMenu.submenus, 'id').indexOf(activeMenu)}
                  className="setting-sidebar-menu"/>
                <CascadeMenu
                  item={postsMenu}
                  activeIndex={map(postsMenu.submenus, 'id').indexOf(activeMenu)}
                  className="setting-sidebar-menu"/>
                {
                  map(nokRequests.items, item => {
                    return (
                      <NavLink key={item.id} to={`/dashboard/${item.veteran.id}`}
                               className={`setting-sidebar-link ${map(profileMenu.submenus, 'id').indexOf(activeMenu) > -1 ? 'active' : ''}`}>
                        {`Go to ${item.veteran.firstName} ${item.veteran.midName} ${item.veteran.lastName} Profile`}</NavLink>
                    )
                  })
                }
              </div>
            }
            {
              admin &&
              <div className={`setting-sidebar ${showMenu ? 'sidebar-show-menu' : ''}`} onClick={this.toggleMenu}>
                <CascadeMenu
                  item={adminPostsMenu}
                  activeIndex={map(adminPostsMenu.submenus, 'id').indexOf(activeMenu)}
                  className="setting-sidebar-menu"/>
                <CascadeMenu
                  item={adminRequestMenu}
                  activeIndex={map(adminRequestMenu.submenus, 'id').indexOf(activeMenu)}
                  className="setting-sidebar-menu"/>
                <CascadeMenu
                  item={adminUsersMenu}
                  activeIndex={map(adminUsersMenu.submenus, 'id').indexOf(activeMenu)}/>
              </div>
            }
            <div className="setting-content">
              {
                activeMenu === 'Basic Details' &&
                <SettingBasicDetails details={user} faqs={faqs || []} updateProfile={this.updateBaseProfile}
                                     deactivate={this.deactivate}/>
              }
              {
                activeMenu === 'NOK Request' &&
                <SettingRequest veterans={get(veteranNames, 'items')}
                                acceptedProof={DEFAULT_PROFILE_DATA.acceptedProof}
                                submitted={nokRequests.items}
                                downloadFile={this.downloadFile}
                                createNokRequest={this.createNokRequest}
                                deleteNokRequest={this.deleteNokRequest}
                />
              }
              {
                activeMenu === 'Notification Preferences' &&
                <SettingPreferences preferences={settingPreferences} updatePreferences={this.updatePreferences}/>
              }
              {
                activeMenu === 'For Review' &&
                <SettingPosts title="Posts to be Reviewed by You" posts={reviewPosts.items}
                              approvePost={this.approvePost} declinePost={this.declinePost}/>
              }
              {
                activeMenu === 'By You' &&
                <SettingPosts title="Posts Created by You" needDelete={true} posts={myPosts.items}
                              deletePost={this.deletePost}
                              approvePost={this.approvePost}
                              declinePost={this.declinePost}/>
              }
              {
                activeMenu === 'Flagged Posts' &&
                <AdminPosts title="Flagged Posts" posts={flagged} deleteFlag={this.deleteFlag}/>
              }
              {
                activeMenu === 'Removed Posts' &&
                <AdminPosts title="Removed Posts" posts={flagged} removed/>
              }
              {
                activeMenu === 'Request For Review' &&
                <AdminRequest title="Next of Kin Request for : Review" requests={reviewRequests.items}
                              decline={this.declineRequest} approve={this.approveRequest}
                              downloadFile={this.downloadFile}/>
              }
              {
                activeMenu === 'Archived Request' &&
                <AdminRequest title="Next of Kin Request for : Archived" requests={archivedRequests.items} downloadFile={this.downloadFile} archived/>
              }
              {
                activeMenu === 'Usage Dashboard' &&
                <AdminUsers title="Users: Usage Dashboard" statis={get(adminUsers, 'statis')}
                            trends={get(adminUsers, 'totalTrends')} totalColor={get(adminUsers, 'totalColor')}/>
              }
              {
                activeMenu === 'Joined This Month' &&
                <AdminUsers title="Users: Joined This Month" statis={get(adminUsers, 'statis')}
                            trends={get(adminUsers, 'thisMonthTrends')} totalColor={get(adminUsers, 'totalColor')}
                            thisMonth/>
              }
            </div>
          </div>
          <MainFooter props={{ ...footerLinks, ...feedback, addClass: 'setting-footer' }}/>
        </main>
      </div>
    )
  }
}

Setting.defaultProps = {
  admin: false,
};

const mapStateToProps = (state) => {
  return {
    ...state.dataReducer,
    ...state.auth,
  }
};

const matchDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
    dataAction: bindActionCreators({ ...dataAction }, dispatch)
  }
};

const ConnectedSetting = connect(mapStateToProps, matchDispatchToProps)(Setting);

export default ConnectedSetting;

export const AdminSetting = props => (<ConnectedSetting admin {...props} />);
