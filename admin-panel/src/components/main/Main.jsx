import React, { Component } from 'react';
import { NavLink} from 'react-router-dom';

class Main extends Component {
    state = {  }
    render() { 
        return ( 
            <section className="d-flex h-100 text-center">
                <div className="cover-container main-full-window d-flex flex-column ">
                <main className="">
                    <h1>Administrator panel</h1>
                    <p className="lead">Welcome to PUZ-Library Administrator panel</p>
                    <p className="lead">
                    <a href="#" className="btn btn-lg btn-secondary fw-bold border-white bg-white">Learn more</a>
                    </p>
                </main>
                </div>
            </section>
         );
    }
}
 
export default Main;