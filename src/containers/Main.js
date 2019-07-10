import React, { Component, Fragment } from "react";
import FloorPlan from "../components/FloorPlan/FloorPlan";
import BookingForecast from "../components/BookingForecast";
import NavBar from "../components/navbar/NavBar";
import ErrorPage from "../components/ErrorPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
      availableTables: [],
      selectedTable: 1,
      selectedPartySize: 0,
      selectedDate: "",
      diningTables: [],
      selectedBooking: {},
      customers: [],
      bookings: [],
      todaysBookings: [],
      customerId: 0,
      urls: [
        { customersURL: "http://localhost:8080/customers" },
        { bookingsURL: "http://localhost:8080/bookings" },
        { diningTablesURL: "http://localhost:8080/diningTables" }
      ]
    };
    this.updatePartySize = this.updatePartySize.bind(this);
    this.makeBooking = this.makeBooking.bind(this);
    this.deleteBooking = this.deleteBooking.bind(this);
    this.postDetails = this.postDetails.bind(this);
    this.fetchDetails = this.fetchDetails.bind(this);
    this.updateSelectedDate = this.updateSelectedDate.bind(this);
    this.updateSelectedTable = this.updateSelectedTable.bind(this);
    this.updateSelectedBooking = this.updateSelectedBooking.bind(this);
  }

  makeBooking(booking) {
    const custDetails = {
      name: booking.name,
      phoneNumber: booking.phone_number
    };
    if (booking.href == "") {
      this.postDetails(
        this.state.urls[0].customersURL,
        custDetails,
        "customers"
      );

      const bookingCustomer = [];

      this.state.customers.forEach(customer => {
        if (customer.name === booking.name) {
          bookingCustomer.push(customer);
        }
      });
      console.log(booking);

      const customerURL = bookingCustomer[0]["_links"].self.href;
      const tableURL = `http://localhost:8080/diningTables/${
        this.state.selectedTable
      }`;
      const bookDetails = {
        date: booking.date,
        time: booking.time,
        partySize: booking.size,
        customer: customerURL,
        diningTable: tableURL
      };

      this.postDetails(this.state.urls[1].bookingsURL, bookDetails, "bookings");
    }
  }

  postDetails(url, body, stateKey) {
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(returnData =>
        this.setState(prevState => {
          return {
            [`${stateKey}`]: prevState[`${stateKey}`].concat(returnData)
          };
        })
      );
  }

  fetchDetails(url, stateKey) {
    fetch(url)
      .then(res => res.json())
      .then(customerData =>
        this.setState({
          [`${stateKey}`]: customerData._embedded[`${stateKey}`]
        })
      );
  }

  deleteBooking() {
    const deleteURL = `http://localhost:8080/bookings/${this.state.selectedBooking}`
    fetch(deleteURL, {
      method: 'DELETE'
    })
    .then(res => {
      if(res.ok) {
        this.fetchDetails(this.state.urls[1].bookingsURL, "bookings")
      }
    })
  }

  updateSelectedBooking(bookingId) {
    this.setState({updateState: true})
    for (const booking of this.state.todaysBookings) {
      if (booking.diningTable.tableName === `Table${bookingId}`) {
        this.setState({selectedBooking: booking})
      }
    }
  }



  updateSelectedTable(newTable) {
    this.setState({ selectedTable: newTable });
  }

  updateSelectedDate(newDate) {
    this.setState({ selectedDate: newDate });
    this.setState({ todaysBookings: [] });
    this.state.bookings.forEach(booking => {
      if (this.state.selectedDate == booking.date) {
        this.setState(prevState => {
          return { todaysBookings: prevState.todaysBookings.concat(booking) };
        });
      }
    });
  }

  updatePartySize(size) {
    this.setState({ selectedPartySize: size });
  }

  componentDidMount() {
    this.fetchDetails(this.state.urls[0].customersURL, "customers");
    this.fetchDetails(this.state.urls[2].diningTablesURL, "diningTables");
    this.fetchDetails(this.state.urls[1].bookingsURL, "bookings");
  }

  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route
              path="/floor-plan"
              render={() => {
                return (
                  <FloorPlan
                    updateSelectedTable={this.updateSelectedTable}
                    selectedPartySize={this.state.selectedPartySize}
                    state={this.state}
                  />
                );
              }}
            />
            <Route
              path="/booking-forecast"
              render={() => {
                return (
                  <BookingForecast
                    selectedDate={this.state.selectedDate}
                    diningTables={this.state.diningTables}
                    bookings={this.state.todaysBookings}
                    updateSelectedBooking={this.updateSelectedBooking}
                  />
                );
              }}
            />
            <Route component={ErrorPage} />
          </Switch>
          <NavBar
            updateState={this.state.updateState}
            selectedBooking={this.state.selectedBooking}
            makeBooking={this.makeBooking}
            deleteBooking={this.deleteBooking}
            customers={this.state.customers}
            updateSelectedDate={this.updateSelectedDate}
            tables={this.state.diningTables}
            selectedTable={this.state.selectedTable}
            updatePartySize={this.updatePartySize}
          />
        </Fragment>
      </Router>
    );
  }
}

export default Main;

// <h2>selected table: {this.state.selectedTable}</h2>
