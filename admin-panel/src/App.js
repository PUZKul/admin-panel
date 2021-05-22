import React, { Component } from 'react';
import './App.css';
import {Route, Switch, HashRouter as Router} from 'react-router-dom';
import Menu from './components/menu/Menu'
import Login from './components/login/Login'
import Reservations from './components/reservations/Reservations'
import Details from './components/ReservationDetails/Details'

class App extends Component {
  state = {
    prefix2: "http://localhost:8080",
    prefix: "https://puz-biblioteka.herokuapp.com",
    token: "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJibGFja2xpc3Q6d3JpdGUifSx7ImF1dGhvcml0eSI6ImJvcnJvdzp3cml0ZSJ9LHsiYXV0aG9yaXR5IjoidXNlcnM6cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYm9va19jb3B5OndyaXRlIn0seyJhdXRob3JpdHkiOiJib29rX2NvcHk6cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYm9va3M6cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYmxhY2tsaXN0OnJlYWQifSx7ImF1dGhvcml0eSI6ImJvcnJvdzpyZWFkIn0seyJhdXRob3JpdHkiOiJyZXNlcnZhdGlvbjp3cml0ZSJ9LHsiYXV0aG9yaXR5IjoiYm9va3M6d3JpdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifSx7ImF1dGhvcml0eSI6InJlc2VydmF0aW9uOnJlYWQifSx7ImF1dGhvcml0eSI6InVzZXJzOndyaXRlIn1dLCJpYXQiOjE2MjExNzI2MjMsImV4cCI6MTYyMzcwODAwMH0.KsBMPpCwZLo65uB06l8-DibCCe430yuBh9WTbG1AvuE9k3x7M6jY2XmcMDRNa56F"
 }

 render(){
  return (
    <Router>
    
        <Menu className="topbar" />
       
        <div className="container pt-5">
            <Switch>
              <Route path='/login' exact render={() => <Login/> } /> 
              <Route path={'/reservations/:id'}  render={() => <Details prefix={this.state.prefix} token={this.state.token}/> } /> 
              <Route path={'/reservations'}  render={() => <Reservations prefix={this.state.prefix} token={this.state.token}/> } />
            </Switch>
        </div>
      
   </Router>
  );
 }
}

export default App;
