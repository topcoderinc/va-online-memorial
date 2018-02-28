import React from 'react';
import './styles.scss';

const MainHeader = ({ props }) => {
  return (
    <div className="master-head">
      <h2>{props.title}</h2>
      <div className="info">{props.info}</div>
      <div className="actions"><a className="btn">Find a Veteran</a></div>
    </div>
  )
}

export default MainHeader;
