import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const CascadeMenu = ({item, activeIndex, className})=>(
  <div className={`cascade-menu ${className}`}>
    <div className={`cascade-title ${activeIndex > -1 ? 'active' : ''}`}>
      <span>{item.title} </span> 
      {activeIndex > -1 && <span className="show-md inline"><span className="slash">/</span>{item.submenus[activeIndex].title}</span>}
      <span className="drop-down-triangle show-md"></span>
    </div>
    <div className="drop-down-border"></div>
    {
      item.submenus.map((menu,i)=>(
        <div className={`cascade-submenu ${activeIndex === i ? 'active' : ''}`} key={i} onClick={menu.onClick}>
          <span className="show-md inline">{item.title}<span className="slash">/</span></span>
          <span>{menu.title}</span>
        </div>
      ))
    }
  </div>
)

CascadeMenu.defaultProps={
  item: {
    title: '',
    submenus: [],
  },
  className: '',
  activeIndex: -1,
}

CascadeMenu.propTypes={
  className: PropTypes.string,
  item: PropTypes.shape({
    title: PropTypes.string,
    submenus: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      onClick: PropTypes.func,
    }))
  }),
  activeIndex: PropTypes.number,
}

export default CascadeMenu;
