import React, { Component, Fragment } from 'react';
import FloorPlan from '../components/FloorPlan/FloorPlan'
import BookingForecast from '../components/BookingForecast';
import NavBar from '../components/navbar/NavBar';

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
          availableTables: [],
          selectedPartySize: 0,
          selectedDate: '',
          diningTables: [],
          customers: [],
          bookings: [],
          customerId: 0,
          urls: [{customersURL:'http://localhost:8080/customers'}, {bookingsURL: 'http://localhost:8080/bookings'}, {diningTablesURL: 'http://localhost:8080/diningTables'}]
        }
        this.updatePartySize = this.updatePartySize.bind(this);
        this.makeBooking = this.makeBooking.bind(this);
        this.postDetails = this.postDetails.bind(this);
        this.fetchDetails = this.fetchDetails.bind(this);
        this.updateSelectedDate = this.updateSelectedDate.bind(this);
    }

    makeBooking(booking) {
        const custDetails = { name: booking.name, phoneNumber: booking.phone_number }
        this.postDetails(this.state.urls[0].customersURL, custDetails, "customers")

        // let customerURL = `http://localhost:8080/customers/nameId/${booking.name}`
        // fetch(`http://localhost:8080/customers/nameId/${booking.name}`)
        //   .then(res => res.json())
        //   .then(customerData => this.setState(prevState => {
        //     return {customerId: customerData[0].id}
        //   })
        // )

        const bookingCustomer = []

        this.state.customers.forEach((customer) => {
          if (customer.name === booking.name) {
            console.log(customer)

            bookingCustomer.push(customer)
          }
        })

        const customerURL = bookingCustomer[0]['_links'].self.href
        const tableURL = 'http://localhost:8080/diningTables/1'
        const bookDetails = { date: booking.date, time: booking.time, party_size: booking.size, customer: customerURL, diningTable: tableURL }

        this.postDetails(this.state.urls[1].bookingsURL, bookDetails, "bookings")
    }

    postDetails(url, body, stateKey ){
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(returnData => this.setState(prevState => {
        return {[`${stateKey}`]: prevState[`${stateKey}`].concat(returnData)}
      }))
    }

    fetchDetails(url, stateKey) {
      fetch(url)
          .then(res => res.json())
          .then(customerData => this.setState({[`${stateKey}`]: customerData._embedded[`${stateKey}`]}
          ))
    }

    updateSelectedDate(newDate) {
      this.setState({selectedDate: newDate})
    }

    updatePartySize(size) {
      this.setState({selectedPartySize: size})
    }

    componentDidMount(){
      this.fetchDetails(this.state.urls[0].customersURL, "customers")
      this.fetchDetails(this.state.urls[2].diningTablesURL, "diningTables")
      this.fetchDetails(this.state.urls[1].bookingsURL, "bookings")
    }

    render() {
      return (
        <Fragment>
        <h2>{this.state.customerId}</h2>
        <FloorPlan
          state={this.state}
          selectedPartySize={this.state.selectedPartySize} />
        <NavBar
          updatePartySize={this.updatePartySize}
          makeBooking={this.makeBooking}
          customers={this.state.customers}
          updateSelectedDate={this.updateSelectedDate}
          tables={this.state.diningTables}/>
        </Fragment>
      )
    }
}

export default Main;

// <BookingForecast tables={this.state.diningTables} />
