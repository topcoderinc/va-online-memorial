import React from 'react';
import './styles.scss';

const ShareMemories = ({props}) => {
  return (
     <div className="share-memories">
       <div className="con-mem">
         <h2>{props.title}</h2>
         <div className="desc">{props.desc}</div>
         <div className="become-member">
           <div className="row">
             <input type="email" className="mail" placeholder="Enter your email address" />
           </div>
           <div className="action">
             <a className="btn">Become a Member</a>
           </div>
         </div>
       </div>
     </div>
  )
}

export default ShareMemories;
