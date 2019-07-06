import React, { Component, Fragment } from 'react';
import './Calendar.css';

class Calendar extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedDate: '',
      calendarDays: []
    }
    this.makeDays = this.makeDays.bind(this)
  }

  // const calendarDays = []


  componentDidMount() {
    this.makeDays();
  }

  makeDays () {
    let dates = []
    for (let i=1; i<32; i++){
      dates.push(i);
    }
    let days = dates.map((date, index) => {
      return <button className='day'>{date}</button>
    })

    this.setState({calendarDays: days})
  }

render() {
  return (
    <Fragment>
      <div className='calendar'>
        {this.state.calendarDays}
      </div>
    <h1>Hello</h1>
    </Fragment>
  )
}

}

export default Calendar;