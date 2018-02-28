import React, { Component } from 'react';
import './styles.scss';

class Toggler extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      toggleState: ''
    };
  }

  componentWillMount(){
    this.setState({
      'toggleState': !!this.props.attr.isOpen ? 'open' : ''
    })
  }

  toggle(){
    this.setState({
      'toggleState': this.state.toggleState === 'open' ? '' : 'open'
    })
  }

  render () {
    return(
      <div className={"togger-wrap " + this.state.toggleState + 
      (!!this.props.attr.addClass ? this.props.attr.addClass : '')}>
        <div className="toggler">
          {
            !!this.props.attr.isToggleDisabled
            ?( 
              <h4>
                {this.props.attr.title}
                <a className="toggle-ico"> </a>
              </h4>
            )
            : (
                <h4
                  onClick={this.toggle} >
                  {this.props.attr.title}
                  <a className="toggle-ico"> </a>
                </h4>
              )
          }
        
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Toggler;
