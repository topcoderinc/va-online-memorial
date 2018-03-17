import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toggler from '../Toggler';
import './setting-basic-details.scss';

class SettingBasicDetails extends Component{
  constructor(props){
    super(props);
    this.state={
      details: props.details,
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.details.initial && !nextProps.details.initial){
      this.setState({
        details: nextProps.details,
      })
    }
  }

  handleChange = (key, value)=>{
    this.setState({
      details: {
        ...this.state.details,
        [key]: value,
      }
    })
  }

  render(){
    const {details} = this.state;
    const {faqs} = this.props;
    return (
      <div className="setting-basic-details">
        <h2 className="basic-details-title">Basic Details</h2>
        <div className="basic-details-row">
          <div className="basic-details-col-1">
            <div className="basic-details-label">Username</div>
            <input className="basic-details-input textctrl" type="text" value={details.userName} onChange={e=>this.handleChange('userName', e.target.value)}/>
            <div className="basic-details-label">Gender</div>
            <div className="basic-details-radio-group">
              <div className={"basic-details-fieldset fieldset fieldset-opt"}>
                <a className={"radioctrl "
                  + (details.gender === 'Male' ? 'checked' : '')}
                  onClick={() => this.handleChange('gender', 'Male')}
                >Male</a>
              </div>
              <div className={"basic-details-fieldset fieldset fieldset-opt"}>
                <a className={"radioctrl "
                  + (details.gender === 'Female' ? 'checked' : '')}
                  onClick={() => this.handleChange('gender', 'Female')}
                >Female</a>
              </div>
            </div>
          </div>
          <div className="basic-details-col-2">
            <div className="basic-details-label"><span>Email</span><span className="basic-details-change-pwd">Change Password</span></div>
            <input className="basic-details-input textctrl" type="text" value={details.email} onChange={e=>this.handleChange('email', e.target.value)}/>
            <div className="basic-details-label">Mobile Number</div>
            <input className="basic-details-input textctrl" type="text" value={details.phone} onChange={e=>this.handleChange('phone', e.target.value)}/>
          </div>
        </div>
        <div className="basic-details-actions">
          <a className="btn btn-clear">Deactivate Account</a>
          <a className="btn">Save Change</a>
        </div>
        <h2 className="basic-details-title">FAQs</h2>
        {
          faqs.map((f,i)=>(
            <Toggler key={i} attr={{
              title: f.title,
              isOpen: i===0
            }}>
              <div className="faq-content">
              {f.content}
              </div>
            </Toggler>
          ))
        }
      </div>
    )
  }
}

SettingBasicDetails.defaultProps={
  details: {
    userName: '',
    email: '',
    phone: '',
    initial: true,
  },
  faqs: [],
}

SettingBasicDetails.props={
  details: PropTypes.shape({
    userName: PropTypes.string,
    email: PropTypes.string,
    gender: PropTypes.oneOf(['Male', 'Female']),
    phone: PropTypes.string,
  }),
  faqs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }))
}

export default SettingBasicDetails;