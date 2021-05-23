import React, { Component } from 'react';
import './App.css';
import {Route, Switch, HashRouter as Router} from 'react-router-dom';
import Menu from './components/menu/Menu'
import Login from './components/login/Login'
import Reservations from './components/reservations/Reservations'
import Details from './components/ReservationDetails/Details'
import Main from './components/main/Main'

class App extends Component {
  state = {
    isLogin: false,
    prefix2: "http://localhost:8080",
    prefix: "https://puz-biblioteka.herokuapp.com",
    token: ""
 }
 

 setToken = (token) => {
  this.setState({token: token, isLogin: true});
 }

 clearToken = () =>{
   this.setState({token: null, isLogin: false});
 }

 render(){
  return (
    <Router>
        <Menu className="topbar" clearToken={this.clearToken} isLogin={this.state.isLogin}/>
       
        <div className="container pt-5">
            <Switch>
              <Route path='/' exact render={() => <Main/> } /> 
              <Route path='/login' render={() => <Login prefix={this.state.prefix} setToken={this.setToken}/> } /> 
              <Route path={'/reservations/:id'}  render={() => <Details prefix={this.state.prefix} token={this.state.token}/> } /> 
              <Route path={'/reservations'}  render={() => <Reservations prefix={this.state.prefix} token={this.state.token}/> } />
            </Switch>
        </div>
      
   </Router>
  );
 }
}

export default App;
