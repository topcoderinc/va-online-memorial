import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dataAction from '../../actions/dataAction';
import actions from '../../actions/auth';
import MainHeaderComponent from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import SearchTable from '../../components/SearchTable';
import Toggler from '../../components/Toggler';
import '../../containers/Search/search.scss';


class Search extends Component {
  constructor(props) {
    super(props);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    
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

  // toggleFilter
  toggleFilter() {
    this.setState({
      isFilterView: !this.state.isFilterView
    })
  }

  // closeFilter
  closeFilter() {
    this.setState({
      isFilterView: false
    })
  }

  render() {
    const { footerLinks, feedback, searchedResults, searchedAllResults, notifications} = {...this.props.db};

    return (
      <div className="page-wrapper">
        <MainHeaderComponent attr={ {'searchedResults': searchedResults, addClass: 'hasborder', notifications: notifications} } />

          <main className="main hasborder">
          <div className={"search-section " + (this.state.isFilterView ? 'open' : '')}>
           <div className="viewport">
              <form id="filter-form" className="col col-filter" ref="filterForm">
                <h3 className="sidebar-title">Filters <a 
                  onClick={this.closeFilter}
                 className="close-sidebar"> </a> </h3>

                <Toggler attr={ {title: 'Branch of service', addClass: 'alt', 'isToggleDisabled':true} }>
                 <div className="toggler-con">
                   <select className="selectctrl">
                     <option value="Select">-Select-</option>
                     <option value="Mock val">-Mock val-</option>
                   </select>
                 </div>
                </Toggler>

                  <Toggler attr={ {title: 'Date of Birth',  addClass: 'alt', 'isToggleDisabled':true} }>
                   <div className="toggler-con fx fields-3">
                     <div className="gr gr-1">
                       <h6>Month</h6>
                       <input type="text" className="textctrl mm"/>
                     </div>
                     <div className="gr gr-2">
                       <h6>Day</h6>
                       <input type="text" className="textctrl dd"/>
                     </div>
                     <div className="gr gr-3">
                       <h6>Year</h6>
                       <input type="text" className="textctrl yy"/>
                     </div>
                   </div>
                  </Toggler>

                  <Toggler attr={ {title: 'Date of Passed Away',  addClass: 'alt', 'isToggleDisabled':true} }>
                   <div className="toggler-con fx fields-3">
                     <div className="gr gr-1">
                       <h6>Month</h6>
                       <input type="text" className="textctrl mm"/>
                     </div>
                     <div className="gr gr-2">
                       <h6>Day</h6>
                       <input type="text" className="textctrl dd"/>
                     </div>
                     <div className="gr gr-3">
                       <h6>Year</h6>
                       <input type="text" className="textctrl yy"/>
                     </div>
                   </div>
                  </Toggler>

                <Toggler attr={ {title: 'Burial Location',  addClass: 'alt', 'isToggleDisabled':true} }>
                 <div className="toggler-con">
                   <select className="selectctrl">
                     <option value="Select">-Select-</option>
                     <option value="Mock val">-Mock val-</option>
                   </select>
                 </div>
                </Toggler>
                
                <Toggler attr={ {title: 'Location Served',  addClass: 'alt', 'isToggleDisabled':true} }>
                 <div className="toggler-con">
                   <input type="text" className="textctrl fluid"/>
                 </div>
                </Toggler>
                
                <Toggler attr={ {title: 'Division',  addClass: 'alt', 'isToggleDisabled':true} }>
                 <div className="toggler-con">
                   <input type="text" className="textctrl fluid"/>
                 </div>
                </Toggler>

                <Toggler attr={ {title: 'Squadron / Ship',  addClass: 'alt', 'isToggleDisabled':true} }>
                 <div className="toggler-con">
                   <input type="text" className="textctrl fluid"/>
                 </div>
                </Toggler>

                <div className="bar-action">
                  <a className="btn fluid">Update Results</a>
                </div>

                <div className="bar-reset">
                  <a className="lnk"
                    onClick={() => this.refs.filterForm.reset()}
                  >Reset Filter</a>
                </div>

              </form>
              <div className="col col-result">
             {  !!this.state.keyword 
               ?(
                 <div>
                  <h3 className="fx"><span><span className="count"> 268</span> Results for  <span className='keyword'>“{this.state.keyword}”</span></span>

                    <a 
                      onClick={this.toggleFilter}
                     className="btn btn-filter">Filter</a>
                  </h3>
                  <SearchTable attr={ {keyword: this.state.keyword, searchedResults: searchedAllResults, addClass: 'fullpage'} } />
                 </div>
                )
               : (<h3>Search Results</h3>)
             }
             </div>
            </div>
          </div>

          <MainFooter props={ {...footerLinks, ...feedback, ...{addClass: 'sticky'}} } />
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
