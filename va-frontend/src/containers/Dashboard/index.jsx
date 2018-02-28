import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dataAction from '../../actions/dataAction';
import actions from '../../actions/auth';
import MainHeaderComponent from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import ProfileCard from '../../components/ProfileCard';
import ProfileInfoTabs from '../../components/ProfileInfoTabs';
import RelatedProfiles from '../../components/RelatedProfiles';
import '../../containers/Search/search.scss';


class Search extends Component {
  constructor(props) {
    super(props);
    this.$s = this.$s.bind(this);

    this.state = {
      isLoginActive: false,
      isRegisterActive: false,
      keyword: 'John',
      isSearchFocused: false
    };
  }

  componentWillMount() {
    this.props.dataAction.getData();
  }

  // state update function
  $s(attr, delay){
    return () => {
      if(!!delay){
        window.setTimeout(()=>{
          this.setState({ ...attr });
          }, delay)
        }else{
          this.setState({ ...attr });
        }
    }
  }

  render() {
    const { footerLinks, feedback, searchedResults, 
      profileCard, profileInfoTabs, relatedProfiles} = {...this.props.db};
      
    return (
      <div className="page-wrapper">
        <MainHeaderComponent attr={ {'searchedResults': searchedResults} } />

          <main className="main">
          {!!profileCard && (<ProfileCard attr={{ ...profileCard }} />)}
          {!!profileInfoTabs && (<ProfileInfoTabs { ...profileInfoTabs } />)}
          {!!relatedProfiles && (<RelatedProfiles props={{...relatedProfiles}} />)}
          

          <MainFooter props={ {...footerLinks, ...feedback} } />
        </main>
      </div>
    )
  }
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

export default connect(mapStateToProps, matchDispatchToProps)(Search);
