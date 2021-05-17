import logo from './logo.svg';
import './App.css';
import {Route, Switch, HashRouter as Router} from 'react-router-dom';
import Menu from './components/menu/Menu'
import Login from './components/login/Login'
import Reservations from './components/reservations/Reservations'
function App() {
  return (
    <Router>
    
        <Menu className="topbar" />
       
        <div className="container pt-5">
            <Switch>
              <Route path='/login' exact render={() => <Login/> } /> 
              {/* <Route path={'/book/:id'}  render={() => <Details books={this.state.book} /> } /> */}
              <Route path={'/reservations'}  render={() => <Reservations/> } />
            </Switch>
        </div>
      
   </Router>
  );
}

export default App;
