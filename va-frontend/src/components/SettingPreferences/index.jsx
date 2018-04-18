import React from 'react';
import {isEmpty, map, forEach, every, some} from 'lodash';

import './setting-preferences.scss';

const fields = ['email', 'mobile', 'site'];

class SettingPreferences extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      allCheck: map(fields, ()=>false),
      allUncheck: map(fields, ()=>false),
      preferences: props.preferences,
    }
  }

  componentDidMount(){
    this.autoCheck();
  }

  componentWillReceiveProps(nextProps){
    if(isEmpty(this.props.preferences) && !isEmpty(nextProps.preferences)){
      this.setState({
        preferences: nextProps.preferences,
      }, this.autoCheck)
    }
  }

  checkAll = (field, value)=>{
    const {preferences, allCheck, allUncheck} = this.state;
    forEach(preferences, p=>{
      p[field] = value;
    });
    if(value){
      allCheck[field] = value;
      allUncheck[field] = !value;
    }else{
      allCheck[field] = value;
      allUncheck[field] = !value;
    }
    this.setState({
      preferences,
      allCheck,
      allUncheck,
    })
  }

  onChange = (i, key, value)=>{
    const { preferences} = this.state;
    preferences[i][key] = value;
    this.setState({
      preferences,
    }, this.autoCheck)
  }

  autoCheck = ()=>{
    const {allCheck, allUncheck, preferences} = this.state;

    forEach(fields, key=>{
      if(every(preferences, p=>p[key])){
        allCheck[key] = true;
      }
      if(some(preferences, p=>!p[key])){
        allCheck[key] = false;
      }
      if(every(preferences, p=>!p[key])){
        allUncheck[key] = true;
      }
      if(some(preferences, p=>p[key])){
        allUncheck[key] = false;
      }
      this.setState({
        allCheck,
        allUncheck,
      })
    })
  }

  render(){
    const {allCheck, allUncheck, preferences} = this.state;

    return (
      <div className="setting-preferences">
        <h2 className="preferences-title">Notification Preferences</h2>
        <div className="preferences-table">
          <div className="table-head">
            <div className="table-row">
              <div className="table-cell">Notify of these actions by</div>
              <div className="table-cell">Email</div>
              <div className="table-cell">Mobile</div>
              <div className="table-cell">Site Notification</div>
            </div>
          </div>
          <div>
          {
            preferences.map((p,i)=>(
              <div key={i} className="table-row">
                <div className="table-cell">{p.actionBy}</div>
                {
                  fields.map((f, j)=>(
                    <div key={j} className="table-cell">
                      <div className="checkboxctrl">
                        <label>
                          <input type="checkbox" checked={p[f]} onChange={e=>this.onChange(i, f, e.target.checked)}/>
                          <span className="checkbox-icon"></span>
                          <span className="checkbox-label">{f}</span>
                        </label>
                      </div>
                    </div>
                  ))
                }
              </div>
            ))
          }
          <div className="table-row">
            <div className="table-cell">Subscribe to all</div>
            {
              fields.map((f,i)=>(
                <div key={i} className="table-cell">
                  <div className={"fieldset fieldset-opt"}>
                    <a className={"radioctrl "
                      + (allCheck[f] ? 'checked' : '')}
                      onClick={() => this.checkAll(f, true)}
                    ><span className="radio-label">{f}</span></a>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="table-row">
            <div className="table-cell">Unsubscribe</div>
              {
                fields.map((f,i)=>(
                  <div key={i} className="table-cell">
                    <div className={"fieldset fieldset-opt"}>
                      <a className={"radioctrl "
                        + (allUncheck[f] ? 'checked' : '')}
                        onClick={() => this.checkAll(f, false)}
                      ><span className="radio-label">{f}</span></a>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="preferences-actions">
          <a className="btn">Save Changes</a>
        </div>
      </div>
    )
  }
}

SettingPreferences.defaultProps = {
  preferences: [],
}

export default SettingPreferences;