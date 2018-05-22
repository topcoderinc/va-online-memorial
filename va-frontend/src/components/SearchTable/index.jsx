import React, {Component} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import Pagination from "react-js-pagination";

import './styles.scss';
import AuthService from "../../services/auth";

class SearchTable extends Component {
  constructor(props) {
    super(props);
    
    this.toggle = this.toggle.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = {
      toggleState: '',
      activePage: 1,
      itemsPerPage: props.attr.limit,
      redirectTo: null,
    };
  }
  
  /**
   * show or hide search table
   */
  toggle() {
    this.setState({
      'toggleState': this.state.toggleState === 'open' ? '' : 'open'
    })
  }
  
  /**
   *  handle page number change
   * @param pageNumber the page number
   */
  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => this.props.attr.handlePageChange((pageNumber - 1) * this.state.itemsPerPage));
  }
  
  /**
   * high light keyword
   * @param keyword the keyword
   * @param text the keyword text
   * @return {*}
   */
  highlightText(keyword, text) {
    if (!!keyword) {
      let newText = text;
      let re = new RegExp(keyword, "g");
      newText = newText.replace(re, '<strong>' + keyword + '</strong>');
      return newText;
    } else {
      return text;
    }
  }
  
  /**
   * on user click
   * @param link
   */
  onItemClick(link) {
    if (AuthService.getCurrentUser()) {
      this.setState({ redirectTo: link });
    } else {
      console.log(window.showLoginDialog)
      if (window.showLoginDialog) {
        window.showLoginDialog();
      }
    }
  }
  
  render() {
    let { keyword, searchedResults, addClass } = { ...this.props.attr };
    return (
      <div className={"searchtable-wrap " + addClass}>
        {this.state.redirectTo && <Redirect to={this.state.redirectTo}/>}
        <div className="datatable">
          <table>
            <tbody>
            <tr className="hide-md">
              <th>Name</th>
              <th>Life</th>
              <th className="hide-md">Buried at</th>
              <th className="hide-md">Branch</th>
              <th className="hide-md">Rank</th>
            </tr>
            {
              !!searchedResults && searchedResults.map((item, i) => {
                return (
                  (
                    <tr key={i}>
                      <td>
                        <div className="td-user">
                          <a onClick={() => this.onItemClick(`/dashboard/${item.id}`)} className="user"><img
                            src={item.profilePicture || 'i1.png'} alt=""/>
                            <span dangerouslySetInnerHTML={{ __html: this.highlightText(keyword, item.name) }}/>
                          </a>
                          <div className="txt view-md">{item.burriedAt}</div>
                        </div>
                      </td>
                      <td>{item.life}</td>
                      <td className="hide-md">{item.burriedAt} </td>
                      <td className="hide-md">{item.branches.length > 0 ? item.branches[ 0 ].name : ''}</td>
                      <td className="hide-md">{item.ranks.length > 0 ? item.ranks[ 0 ].name : ''}</td>
                    </tr>
                  )
                )
                
              })
            }
            </tbody>
          </table>
        </div>
        
        <div className="action">
          <NavLink to="/search" className="btn">View All</NavLink>
        </div>
        
        <div className="pagination-wrap">
          {!!searchedResults
            ? (<Pagination
              hideDisabled
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.itemsPerPage}
              totalItemsCount={this.props.attr.total}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              linkClassFirst={'hide'}
              linkClassLast={'hide'}
              nextPageText={"Next"}
              prevPageText={"Prev"}
              linkClassNext={"next"}
              linkClassPrev={"prev"}
            />)
            : ''
          }
        </div>
      </div>
    );
  }
}

export default SearchTable;
