import React from 'react';
import './main-footer.scss';
 
const MainFooter = ({props}) => {
  let contactCenter= !!props.contactCenter ? props.contactCenter : {};
  return (
    <footer className={"main-footer " + (props.addClass)}>
      <div className="links-area">
      <div className="viewport">
        <div className="gr-lt">
          <section className="footer-sn">
            <h3>Contact Center</h3>
            <div className="desc">
                <div className="r-mail"><a href={'mailto:' + contactCenter.email}>{contactCenter.email}</a></div>
                <div className="r-tel"><a href={'tel:' + contactCenter.tel}>{contactCenter.tel}</a>, <a href={'tel:' + contactCenter.telAlt}>{contactCenter.telAlt}</a></div>
              <div className="r-addr" dangerouslySetInnerHTML={{ __html: contactCenter.address }}></div>
            </div>
          </section>
          <section className="footer-sn">
            <h3>Quick Link</h3>
            <div className="links-list">
              {
                !!props.quickLinks 
                ? props.quickLinks.map( (item, i) => {
                  return (
                    <div key={i} className="r-lnk">
                      <a href={item.link}>{item.label}</a>
                    </div>
                  )
                })
                : ''
              }
            </div>
          </section>
        </div>

        <div className="gr-rt">
            <section className="footer-sn social-sn">
              <h3>We Go Social</h3>
              <div className="bar-socl">
                <a className="fb"> </a>
                <a className="gp"> </a>
                <a className="tw"> </a>
                <a className="yt"> </a>
                <a className="ig"> </a>
              </div>
              <div className="action">
                <a className="btn">Subscribe</a>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="bar-feedback">
        <div className="viewport">
          <h4>{props.title}</h4>
          <div className="desc">{props.feedbackDesc}</div>
        </div>
      </div>

      
    </footer>
  )
}

export default MainFooter;
