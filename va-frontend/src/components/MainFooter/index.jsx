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
                <div className="r-tel">Information on VA burial benefits is available from local VA national cemetery offices, from the Internet at <a href="http://www.cem.va.gov">www.cem.va.gov</a>, or by calling VA regional offices toll-free at <a href={'tel:' + contactCenter.officeTel}>{contactCenter.officeTel}</a>.<br/>
                To make burial arrangements at any open VA national cemetery at the time of need, call the National Cemetery Scheduling Office at <a href={'tel:' + contactCenter.scheduleTel}>{contactCenter.scheduleTel}</a></div>
                <div className="r-mail">Email Veterans Legacy Program: <a href={'mailto:' + contactCenter.email}>{contactCenter.email}</a></div>
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
                <a className="fb" href="https://www.facebook.com/NationalCemeteries"> </a>
                <a className="gp"> </a>
                <a className="tw" href="https://twitter.com/VANatCemeteries"> </a>
                <a className="yt" href="https://www.youtube.com/playlist?list=PL7897A1FCC5516DDE"> </a>
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
