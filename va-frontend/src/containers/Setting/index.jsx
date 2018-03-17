import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { map, get } from 'lodash';
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
import './setting.scss';

class Setting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMenu: props.admin ? 'Flagged Posts' : 'Basic Details',
    };
  }

  componentWillMount() {
    this.props.dataAction.getData();
  }

  activateMenu = (menu) => {
    if(menu !== this.state.activeMenu){
      this.setState({
        activeMenu: menu,
        showMenu: false,
      })
    }
  }

  toggleMenu = show =>{
    this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  render() {
    const { admin, db } = this.props;

    const { footerLinks, feedback, searchedResults, settingBasicDetails, 
      faqs, notifications, settingRequest, profileCard, settingPreferences, 
      settingPosts, adminPosts, adminRequest, adminUsers} = db;

    const profileMenu = {
      title: 'Profile',
      submenus: map(['Basic Details', 'NOK Request', 'Notification Preferences'], 
        t=>({id: t, title: t, onClick: ()=>this.activateMenu(t)}))
    }

    const postsMenu = {
      title: 'Posts',
      submenus: [
        {id: 'For Review', title: `For Review (${get(settingPosts, 'review.length', 0)})`, onClick: ()=>this.activateMenu('For Review')},
        {id: 'By You', title: `By You (${get(settingPosts,'byYou.length', 0)})`, onClick: ()=>this.activateMenu('By You')},
      ]
    }

    const adminPostsMenu = {
      title: 'Posts',
      submenus: [
        {id: 'Flagged Posts', title: 'Flagged', onClick: ()=>this.activateMenu('Flagged Posts')},
        {id: 'Removed Posts', title: 'Removed', onClick: ()=>this.activateMenu('Removed Posts')},
      ]
    }

    const adminRequestMenu = {
      title: 'NOK Request',
      submenus: [
        {id: 'Request For Review', title: 'For Review', onClick: ()=>this.activateMenu('Request For Review')},
        {id: 'Archived Request', title: 'Archived', onClick: ()=>this.activateMenu('Archived Request')},
      ]
    }

    const adminUsersMenu = {
      title: 'Users',
      submenus: [
        {id: 'Usage Dashboard', title: 'Usage Dashboard', onClick: ()=>this.activateMenu('Usage Dashboard')},
        {id: 'Joined This Month', title: 'Joined This Month', onClick: ()=>this.activateMenu('Joined This Month')},
      ]
    }

    const { activeMenu, showMenu } = this.state;

    const userName = admin ? 'Admin007' : 'Jared Smith';

    return (
      <div className="page-wrapper setting-page">
        <MainHeaderComponent attr={ {'searchedResults': searchedResults, userName: userName, notifications: notifications, nok: !admin} } />
          <main className="main">
          <div className="welcome-banner">
            <div className="viewport">
              <div className="welcome-title">{admin ? `Welcome, ${userName}` : 'Hi There, Welcome to your Profile'}</div>
              {
                admin ?
                (<div>View your dashboard, accept user registrations, NOK Requests and posts that have been marked as Flagged</div>) :
                (<div className="welcome-content">From here you can update your win profile, manage Next of Kin Requests and view your preferences.</div>)}
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
                <div
                  className={`setting-sidebar-link ${map(profileMenu.submenus, 'id').indexOf(activeMenu) > -1 ? 'active' : ''}`}>
                  Go to John Brown Profile</div>
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
                  activeIndex={map(adminUsersMenu.submenus, 'id').indexOf(activeMenu)} />
              </div>
            }
            <div className="setting-content">
              {
                activeMenu === 'Basic Details' &&
                <SettingBasicDetails details={settingBasicDetails} faqs={faqs}/>
              }
              {
                activeMenu === 'NOK Request' &&
                <SettingRequest veterans={get(settingRequest,'veterans')} acceptedProof={get(profileCard, 'acceptedProof')} submitted={get(settingRequest, 'submitted')}/>
              }
              {
                activeMenu === 'Notification Preferences' &&
                <SettingPreferences preferences={settingPreferences}/>
              }
              {
                activeMenu === 'For Review' &&
                <SettingPosts title="Posts to be Reviewd by You" posts={get(settingPosts, 'review')}/>
              }
              {
                activeMenu === 'By You' &&
                <SettingPosts title="Posts Created by You" posts={get(settingPosts, 'byYou')}/>
              }
              {
                activeMenu === 'Flagged Posts' &&
                <AdminPosts title="Flagged Posts" posts={get(adminPosts, 'flagged')}/>
              }
              {
                activeMenu === 'Removed Posts' &&
                <AdminPosts title="Removed Posts" posts={get(adminPosts, 'removed')} removed/>
              }
              {
                activeMenu === 'Request For Review' &&
                <AdminRequest title="Next of Kin Request for : Review" requests={get(adminRequest, 'review')}/>
              }
              {
                activeMenu === 'Archived Request' &&
                <AdminRequest title="Next of Kin Request for : Archived" requests={get(adminRequest, 'archived')} archived/>
              }
              {
                activeMenu === 'Usage Dashboard' &&
                <AdminUsers title="Users: Usage Dashboard" statis={get(adminUsers, 'statis')} trends={get(adminUsers, 'totalTrends')} totalColor={get(adminUsers, 'totalColor')}/>
              }
              {
                activeMenu === 'Joined This Month' &&
                <AdminUsers title="Users: Joined This Month" statis={get(adminUsers, 'statis')} trends={get(adminUsers, 'thisMonthTrends')} totalColor={get(adminUsers, 'totalColor')} thisMonth/>
              }
            </div>
          </div>
          <MainFooter props={ {...footerLinks, ...feedback, addClass: 'setting-footer'} } />
        </main>
      </div>
    )
  }
}

Setting.defaultProps={
  admin: false,
}

const mapStateToProps = (state) => {
  return {
   ...state.dataReducer
  }
};

const matchDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
    dataAction: bindActionCreators({...dataAction}, dispatch)
  }
};

const ConnectedSetting = connect(mapStateToProps, matchDispatchToProps)(Setting);

export default ConnectedSetting;

export const AdminSetting = props => (<ConnectedSetting admin {...props} />);
