import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dataAction from '../../actions/dataAction';
import actions from '../../actions/auth';
import MainHeaderComponent from '../../components/MainHeader';
import MasterHead from '../../components/Masterhead';
import Features from '../../components/Features';
import ShareMemories from '../../components/ShareMemories';
import FeaturedPosts from '../../components/FeaturedPosts';
import MainFooter from '../../components/MainFooter';

class Landing extends Component {
  componentWillMount() {
    this.props.dataAction.getData();
  }

  render() {
    const {masterHead, features, memories, featuredPosts, footerLinks, feedback, searchedResults} = {...this.props.db};
    return (
      <div className="page-wrapper">
        <MainHeaderComponent attr={ {'searchedResults': searchedResults} } />
        <main className="main">
          <MasterHead props={ {...masterHead} } />
          <Features props={ {features: features} } />
          <ShareMemories props={ {...memories} } />
          <FeaturedPosts props={ {featuredPosts: featuredPosts} } />
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

export default connect(mapStateToProps, matchDispatchToProps)(Landing);
