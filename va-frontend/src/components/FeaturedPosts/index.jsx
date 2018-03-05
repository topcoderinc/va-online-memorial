import React from 'react';
import './featured-posts.scss';

const FeaturedPosts = ({props}) => {
  return (
    <div className="features">
      <div className="viewport">
      <h2>Featured Posts</h2>
        <div className="featured-list">
          {
            !!props.featuredPosts && props.featuredPosts.map((item, i)=>{
              return(
                <div key={i} className={item.title.toLowerCase() + ' featured-post'}>
                  <h3> <a>{item.title}</a></h3>
                  <div className="daterange">{item.date}</div>
                  
                  { !!item.imgSrc 
                    ? (<figure className="fig">  <img src={item.imgSrc} alt=""/></figure>)
                    : ''
                  }
                  { !!item.story 
                    ? (<div  className="info">{item.story}
                      <div className="more"><a className="link">Read more</a></div>
                    </div>)
                    : ''
                  }
                  <div className="caption" dangerouslySetInnerHTML={{ __html: item.caption }}></div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default FeaturedPosts;
