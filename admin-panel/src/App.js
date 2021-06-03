import React, { Component } from 'react';
import './App.css';
import {Route, Switch, HashRouter as Router} from 'react-router-dom';
import Menu from './components/menu/Menu'
import Login from './components/login/Login'
import Reservations from './components/reservations/Reservations'
import Details from './components/ReservationDetails/Details'
import Main from './components/main/Main'
import Borrow from './components/borrow/Borrow'
import Users from './components/user/Users'
import EditUser from './components/user/EditUser'
import Request from './components/messages/Request'

class App extends Component {
  state = {
    isLogin: false,
    prefix2: "http://localhost:8080",
    prefix: "https://puz-biblioteka.herokuapp.com",
    token: ""
 }
 
 componentDidMount(){
  this.getLocalToken();
 }

 getLocalToken = () =>{
   console.log("get");
  const _login = localStorage.getItem('isLogin') === 'true';
  if (_login){
    const localToken = localStorage.getItem('token');
    this.setState({token: localToken, isLogin: true});
    return localToken;
  }
 }

 setToken = (token) => {
  localStorage.setItem('token', token); 
  localStorage.setItem('isLogin', 'true'); 
  this.setState({token: token, isLogin: true});
 }

 clearToken = () =>{
  localStorage.setItem('token', ''); 
  localStorage.setItem('isLogin', 'false'); 
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
              <Route path='/borrow' render={() => <Borrow prefix={this.state.prefix}  getToken={this.getLocalToken}/> } /> 
              <Route path='/requests' render={() => <Request prefix={this.state.prefix}  getToken={this.getLocalToken}/> } /> 
              <Route path={'/users/:id'} render={() => <EditUser prefix={this.state.prefix}  getToken={this.getLocalToken}/> } /> 
              <Route path={'/users'} render={() => <Users prefix={this.state.prefix}  getToken={this.getLocalToken}/> } /> 
              <Route path={'/reservations/:id'}  render={() => <Details prefix={this.state.prefix} getToken={this.getLocalToken}/> } /> 
              <Route path={'/reservations'}  render={() => <Reservations prefix={this.state.prefix} getToken={this.getLocalToken}/> } />
            </Switch>
        </div>
      
   </Router>
  );
 }
}

export default App;
