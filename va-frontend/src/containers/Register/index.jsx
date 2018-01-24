import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/auth';
import RegisterComponent from '../../components/Register';

const Register = ({ authenticated, registrationDone, registrationStarted, registrationFailed, register, errorMessage }) => (
  <div className="page-wrapper">
    <RegisterComponent
      loading={registrationStarted}
      failed={registrationFailed && registrationDone}
      errorMessage={errorMessage}
      register={register}/>
  </div>
);

const mapStateToProps = (state) => ({ ...state.auth });

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ ...actions }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Register);
