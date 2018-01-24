import React from 'react';
import './styles.css';

const Spinner = () => (
  <div className="spinner-overlay">
    <div className="spinner">
      <div className="double-bounce1"/>
      <div className="double-bounce2"/>
    </div>
  </div>
);

export default Spinner;
