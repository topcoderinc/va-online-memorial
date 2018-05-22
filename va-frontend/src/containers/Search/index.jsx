import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import dataAction from '../../actions/dataAction';
import actions from '../../actions/auth';
import MainHeaderComponent from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import SearchTable from '../../components/SearchTable';
import Toggler from '../../components/Toggler';
import '../../containers/Search/search.scss';
import {map} from 'lodash';

class Search extends Component {
  constructor(props) {
    super(props);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBirthDateChange = this.handleBirthDateChange.bind(this);
    this.handleDeathDateChange = this.handleDeathDateChange.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.makeFilters = this.makeFilters.bind(this);
    this.updateResult = this.updateResult.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    
    this.$s = this.$s.bind(this);
    
    this.state = {
      isLoginActive: false,
      isRegisterActive: false,
      keyword: props.filters.keyword || '',
      isSearchFocused: false,
      
      // filters
      branchId: props.filters.branchIds || '0',
      squadronShip: props.filters.squadronShip || '',
      offset: props.filters.offset || 0,
      cemeteryId: props.filters.cemeteryId || '0',
      served: props.filters.served || '',
      division: props.filters.division || '',
      birthDateYear: props.filters.birthDateStart ? new Date(props.filters.birthDateStart).getFullYear() + '' : '',
      birthDateMonth: props.filters.birthDateStart ? new Date(props.filters.birthDateStart).getMonth() + 1 + '' : '',
      birthDateDay: props.filters.birthDateStart ? new Date(props.filters.birthDateStart).getDay() + '' : '',
      deathDateYear: props.filters.deathDateStart ? new Date(props.filters.deathDateStart).getFullYear() + '' : '',
      deathDateMonth: props.filters.deathDateStart ? new Date(props.filters.deathDateStart).getMonth() + 1 + '' : '',
      deathDateDay: props.filters.deathDateStart ? new Date(props.filters.deathDateStart).getDay() + '' : '',
    };
  }
  
  componentWillMount() {
    this.props.dataAction.getData();
  }
  
  componentWillReceiveProps(nextProps) {
    // if (!isEmpty(nextProps.filters)) {
    this.setState({
      keyword: nextProps.filters.name || '',
      branchId: nextProps.filters.branchIds || '0',
      squadronShip: nextProps.filters.squadronShip || '',
      served: nextProps.filters.served || '',
      division: nextProps.filters.division || '',
      cemeteryId: nextProps.filters.cemeteryId || '0',
      offset: nextProps.filters.offset || 0,
      birthDateYear: nextProps.filters.birthDateStart ? new Date(nextProps.filters.birthDateStart).getFullYear() + '' : '',
      birthDateMonth: nextProps.filters.birthDateStart ? new Date(nextProps.filters.birthDateStart).getMonth() + 1 + '' : '',
      birthDateDay: nextProps.filters.birthDateStart ? new Date(nextProps.filters.birthDateStart).getDate() + '' : '',
      deathDateYear: nextProps.filters.deathDateStart ? new Date(nextProps.filters.deathDateStart).getFullYear() + '' : '',
      deathDateMonth: nextProps.filters.deathDateStart ? new Date(nextProps.filters.deathDateStart).getMonth() + 1 + '' : '',
      deathDateDay: nextProps.filters.deathDateStart ? new Date(nextProps.filters.deathDateStart).getDate() + '' : '',
    });
    // }
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
  
  zeroFill(s) {
    console.log(s, s.length);
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
    this.setState(state);
  }
  
  handleBirthDateChange(key, value) {
    const state = this.state;
    state[ key ] = value;
    state[ 'offset' ] = 0;
    this.setState(state);
  }
  
  handleDeathDateChange(key, value) {
    const state = this.state;
    state[ key ] = value;
    state[ 'offset' ] = 0;
    this.setState(state);
  }
  
  updateResult() {
    this.props.dataAction.searchVeterans(this.makeFilters());
  }
  
  handlePageChange(offset) {
    const state = this.state;
    state[ 'offset' ] = offset;
    this.setState(state, () => this.props.dataAction.searchVeterans(this.makeFilters()));
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
    });
  }
  
  resetFilter() {
    this.props.dataAction.resetFilter();
  }
  
  render() {
    const { footerLinks, feedback, notifications } = { ...this.props.db };
    const { veterans, branches, cemeteries } = this.props;
    
    return (
      <div className="page-wrapper">
        <MainHeaderComponent attr={{ addClass: 'hasborder', notifications: notifications }}/>
        
        <main className="main hasborder">
          <div className={"search-section " + (this.state.isFilterView ? 'open' : '')}>
            <div className="viewport">
              <form id="filter-form" className="col col-filter" ref="filterForm">
                <h3 className="sidebar-title">Filters <a
                  onClick={this.closeFilter}
                  className="close-sidebar"> </a></h3>
                
                <Toggler attr={{ title: 'Branch of service', addClass: 'alt', 'isToggleDisabled': true }}>
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
                
                <Toggler attr={{ title: 'Date of Birth', addClass: 'alt', 'isToggleDisabled': true }}>
                  <div className="toggler-con fx fields-3">
                    <div className="gr gr-1">
                      <h6>Month</h6>
                      <input type="text" value={this.state.birthDateMonth} className="textctrl mm"
                             onChange={(event) => this.handleDeathDateChange('birthDateMonth', event.target.value)}/>
                    </div>
                    <div className="gr gr-2">
                      <h6>Day</h6>
                      <input type="text" value={this.state.birthDateDay} className="textctrl dd"
                             onChange={(event) => this.handleDeathDateChange('birthDateDay', event.target.value)}/>
                    </div>
                    <div className="gr gr-3">
                      <h6>Year</h6>
                      <input type="text" value={this.state.birthDateYear} className="textctrl yy"
                             onChange={(event) => this.handleDeathDateChange('birthDateYear', event.target.value)}/>
                    </div>
                  </div>
                </Toggler>
                
                <Toggler attr={{ title: 'Date of Passed Away', addClass: 'alt', 'isToggleDisabled': true }}>
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
                
                <Toggler attr={{ title: 'Burial Location', addClass: 'alt', 'isToggleDisabled': true }}>
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
                
                <Toggler attr={{ title: 'Location Served', addClass: 'alt', 'isToggleDisabled': true }}>
                  <div className="toggler-con">
                    <input type="text" value={this.state.served}
                           onChange={(event) => this.handleChange('served', event.target.value)}
                           className="textctrl fluid"/>
                  </div>
                </Toggler>
                
                <Toggler attr={{ title: 'Division', addClass: 'alt', 'isToggleDisabled': true }}>
                  <div className="toggler-con">
                    <input type="text" value={this.state.division}
                           onChange={(event) => this.handleChange('division', event.target.value)}
                           className="textctrl fluid"/>
                  </div>
                </Toggler>
                
                <Toggler attr={{ title: 'Squadron / Ship', addClass: 'alt', 'isToggleDisabled': true }}>
                  <div className="toggler-con">
                    <input type="text" value={this.state.squadronShip} className="textctrl fluid"
                           onChange={(event) => this.handleChange('squadronShip', event.target.value)}/>
                  </div>
                </Toggler>
                
                <div className="bar-action">
                  <a className="btn fluid" onClick={this.updateResult}>Update Results</a>
                </div>
                
                <div className="bar-reset">
                  <a className="lnk"
                    // onClick={() => this.refs.filterForm.reset()}
                     onClick={this.resetFilter}
                  >Reset Filter</a>
                </div>
              
              </form>
              <div className="col col-result">
                {veterans.items && veterans.items.length > 0
                  ? (
                    <div>
                      <h3 className="fx"><span><span className="count"> {veterans.total}</span> Results for  <span
                        className='keyword'>“{this.state.keyword}”</span></span>
                        
                        <a
                          onClick={this.toggleFilter}
                          className="btn btn-filter">Filter</a>
                      </h3>
                      <SearchTable attr={{
                        keyword: this.state.keyword,
                        limit: veterans.limit || 10,
                        total: veterans.total,
                        handlePageChange: this.handlePageChange,
                        searchedResults: veterans.items, addClass: 'fullpage'
                      }}/>
                    </div>
                  )
                  : (<h3>Search Results</h3>)
                }
              </div>
            </div>
          </div>
          
          <MainFooter props={{ ...footerLinks, ...feedback, ...{ addClass: 'sticky' } }}/>
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
    dataAction: bindActionCreators({ ...dataAction }, dispatch)
  }
};

export default connect(mapStateToProps, matchDispatchToProps)(Search);
