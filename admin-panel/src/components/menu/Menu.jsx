import React, { Component } from 'react';
import { NavLink} from 'react-router-dom';
class Menu extends Component {
    state = {  }
    render() { 
        return ( 
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark main-motive" aria-label="Fifth navbar example">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">Library</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample05" aria-controls="navbarsExample05" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
             
              <div className="collapse navbar-collapse justify-content-md-end" id="navbarsExample05">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="#">Borrow</a>
                  </li>
                  <li className="nav-item">
                  <NavLink className="nav-link" to='/reservations'>Reservations</NavLink>
                  </li>
                  <li className="nav-item">
                   <NavLink className="nav-link" to='/login'>Login</NavLink>
                    {/* <a className="nav-link" href="/login">Login</a> */}
                  </li>
                </ul>
              </div>
            </div>
          </nav>
         );
    }
}
 
export default Menu;