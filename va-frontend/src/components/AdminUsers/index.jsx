import React from 'react';
import PropTypes from 'prop-types';
import {map, get, isEqual, flattenDeep, forEach, isDate, times, remove, compact} from 'lodash';
import * as d3 from 'd3';

import './admin-users.scss';

const margin = {top: 20, right: 30, bottom: 40, left: 50};
const width = 800 - margin.left - margin.right;
const height = 320 - margin.top - margin.bottom;
const intervals = [];
times(8, i=>{
  intervals.push(1 * Math.pow(10, i + 2));
  intervals.push(2 * Math.pow(10, i + 2));
  intervals.push(5 * Math.pow(10, i + 2));
});


class AdminUsers extends React.Component{
  constructor(props){
    super(props);
    const trendState = this.props.trends.map(()=>true);
    trendState.push(true);
    this.state = {
      trendState,
      range: 'daily'
    }
  }

  componentDidMount(){
    this.prepareChart();
    this.refreshChart();
  }
  componentWillReceiveProps(nextProps){
    if(!isEqual(this.props.trends, nextProps.trends)){
      const trendState = nextProps.trends.map(()=>true);
      trendState.push(true);
      this.setState({
        trendState,
      })
    }
  }

  componentDidUpdate(prevProps){
    if(!isEqual(this.props.trends, prevProps.trends)){
      this.refreshChart();
    }
  }

  selectTrendType = (i, value)=>{
    const trendState = this.state.trendState;
    trendState[i] = value;
    this.setState({
      trendState,
    }, this.refreshChart);
  }

  prepareChart = ()=>{
    this.svg = d3.select(this.chartNode).append("svg")
      .attr('viewBox', '0 0 800 320')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  calcInterval = (data)=>{
    const max = d3.max(flattenDeep(data), d=>d.data);
    const interval = max / 5;
    for(let i = 0; i < intervals.length; ++i){
      if(intervals[i] > interval){
        return intervals[i];
      }
    }
    return intervals[0];
  }

  refreshChart = ()=>{
    this.svg.selectAll("*").remove();
    const {trends} = this.props;
    const data = compact(map(trends, this.state.range));
    if(data.length === 0){
      return false;
    }
    // parse the date / time
    const parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // define the line
    const valueline = d3.line()
        .x((d) => x(d.date))
        .y((d) => y(d.data));

    const colors = map(trends, 'color')
    colors.push(this.props.totalColor);

    const total = data[0].map(d=>({
      date: d.date,
      data: 0,
    }))
    forEach(data[0], (d, i)=>{
      forEach(data, g=>{
        total[i].data += g[i].data;
      })
    })
    data.push(total);
    remove(data, (v,i)=>!this.state.trendState[i]);
    remove(colors, (v,i)=>!this.state.trendState[i]);

    // format the data
    data.forEach(group=>{
      group.forEach(d=>{
        if(!isDate(d.date)){
          d.date = parseTime(d.date);
        }
      })
    });

    const interval = this.calcInterval(data);

    // Scale the range of the data
    x.domain(d3.extent(flattenDeep(data), d=>d.date));
    y.domain([0, interval * 5]);

    const customXAxis = g=>{
      g.call(d3.axisBottom(x).tickSize(0).tickFormat(v=>{
        if(this.state.range === 'monthly'){
          return d3.timeFormat('%Y %b')(v);
        }else if(this.state.range === 'yearly'){
          return d3.timeFormat('%Y')(v);
        }
        return d3.timeFormat('%b %d')(v);
      }));
      g.select(".domain").remove();
      g.selectAll(".tick text").attr('font-size', 16).attr('fill', '#5d5d66').attr('dy', 30);
    }
    // Add the X Axis
    this.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(customXAxis);

    const customYAxis = g => {
      g.call(d3.axisLeft(y).tickValues([0, interval, interval * 2, interval * 3, interval * 4, interval * 5])
        .tickSize(-width - margin.left - margin.right).tickFormat(v=>{
          if(v > 1000000){
            return (v / 1000000) + 'M';
          }
          if(v > 1000){
            return (v / 1000) + 'K';
          }
          return v;
        }));
      g.select('.domain').remove();
      g.selectAll('.tick line').attr('stroke', '#f1f1f1');
      g.selectAll(".tick text").attr('font-size', 16).attr('fill', '#5d5d66')
        .attr('x', 0).attr('dy', -6).attr('text-anchor', 'start');
    }

    this.svg.append("g")
      .attr('transform', 'translate(' + (-margin.left)  + ', 0)')
      .call(customYAxis)

    // Add the valueline path.
    this.svg.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'trend-line')
        .attr('stroke', (d,i)=>colors[i])
        .attr('d', valueline);
  }

  selectRange = v=>{
    this.setState({
      range: v,
    }, this.refreshChart)
  }

  render(){
    const {title, trends, statis, totalColor, thisMonth} = this.props;

    return (
      <div className="admin-users">
        <h2 className="admin-users-title">
          <span>{title}</span>
          <a className="btn">Save as Report</a>
        </h2>
        <div className="admin-users-statis">
          <div className="statis-veterans">
            <div className="statis-title">Veterans on Platform</div>
            <div className="statis-row">
              <div className="statis-group">
                <div className="statis-count">{get(statis, 'veterans.total', '')}</div>
                <div className="statis-type">Total</div>
              </div>
              <div className="statis-group">
                <div className="statis-count">{get(statis, 'veterans.thisMonth', '')}</div>
                <div className="statis-type">Added this Month</div>
              </div>
            </div>
          </div>
          <div className="statis-nok">
            <div className="statis-title">Next of Kin on Platform</div>
            <div className="statis-row">
              <div className="statis-group">
                <div className="statis-count">{get(statis, 'nok.total', '')}</div>
                <div className="statis-type">Total</div>
              </div>
              <div className="statis-group">
                <div className="statis-count">{get(statis, 'nok.thisMonth', '')}</div>
                <div className="statis-type">Added this Month</div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-users-trend">
          <div className="trend-head">
            <div className="trend-title">Number of Users</div>
            <div className="trend-head-group">
              {
                trends.map((t,i)=>(
                  <div className="checkboxctrl" key={i}>
                    <label>
                      <input type="checkbox" checked={this.state.trendState[i]} onChange={e=>this.selectTrendType(i, e.target.checked)}/>
                      <span className="checkbox-icon"></span>
                      <span className="checkbox-label" style={{color: t.color}}>{t.type}</span>
                    </label>
                  </div>
                ))
              }
              {
                trends.length > 0 &&
                <div className="checkboxctrl">
                  <label>
                    <input type="checkbox" checked={this.state.trendState[trends.length]} onChange={e=>this.selectTrendType(trends.length, e.target.checked)}/>
                    <span className="checkbox-icon"></span>
                    <span className="checkbox-label" style={{color: totalColor}}>Total</span>
                  </label>
                </div>
              }
              <select className="selectctrl trend-select" value={this.state.range} onChange={e=>this.selectRange(e.target.value)}>
                <option value="daily">Show Daily</option>
                <option value="monthly">Show Monthly</option>
                {!thisMonth && <option value="yearly">Show Yearly</option>}
              </select>
            </div>
          </div>
          <div className="trend-chart" ref={n=>{this.chartNode=n}}></div>
        </div>
      </div>
    )
  }
}

AdminUsers.defaultProps = {
  title: '',
  trends: [],
  totalColor: '#5d5d66',
  thisMonth: false,
}

AdminUsers.props = {
  title: PropTypes.string,
  trends: PropTypes.arrayOf(PropTypes.shape()),
  totalColor: PropTypes.string,
  thisMonth: PropTypes.bool,
}

export default AdminUsers;