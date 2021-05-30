import React, { Component } from 'react';
import Moment from 'moment';
import { NavLink} from 'react-router-dom';

class Reservation extends Component {
    state = {
        reservations: [],
        username: "",
        notFound: false,
        errorMessage: ""
     }

    componentDidMount(){
        this.fetchReservations(0, 10, this.state.username);
    }
     

  fetchReservations = (page, limit, username) =>{
    fetch(this.props.prefix + `/api/library/admins/reservations?page=${page}&limit=${limit}&username=${username}`, {
       method: 'GET',
       headers: {"Content-Type": "application/json", "Authorization": this.props.getToken()}
      })
    .then(res => res.json())
    .then(res => {
        if(res.status === 404){
            this.setState({notFound: true, errorMessage: res.message});
        }
        else if (res.status === 403){
            this.setState({notFound: true, errorMessage: "You have to login to administrator account to get access to this resource"})
        }
        else{
            this.setState({reservations: res, notFound: false})
        }       
    })
  }


  confirmReservation = (id) => {
    fetch(`${this.props.prefix}/api/library/admins/confirmBorrow/${id}`,  {
       method: 'POST',
       headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.getToken()
    }
      })
      .then(res => {
          if(res.status === 200){
              alert("Reservation confirmed");
              let filteredArray = this.state.reservations.filter(e => e.id !== id);
              this.setState({reservations: filteredArray});
          }
      });
  }

  cancelReservation = (id) => {
    fetch(`${this.props.prefix}/api/library/admins/reservations/cancel/${id}`,  {
       method: 'POST',
       headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.getToken()
    }
      })
      .then(res => {
          if(res.status === 200){
              alert("Reservation canceled");
              let filteredArray = this.state.reservations.filter(e => e.id !== id);
              this.setState({reservations: filteredArray});
          }
      });
  }

  usernameHandler = (name) =>{
    this.setState({username: name.target.value});
}   

  filterByUsername = (e) =>{
    e.preventDefault();
    this.fetchReservations(0, 10, this.state.username);
  }

    render() { 
        const {reservations, notFound, errorMessage} = this.state;
        if(!reservations.length && notFound===false){
            return (<div>Loading...</div>)
        }
        else if(notFound === true){
            return (
                <section>
                    {this.searchBar()}
                    <div><b>{errorMessage}</b></div> 
                </section>
            )
        }
        return ( 
            <section>
            {this.searchBar()}            
            {this.state.reservations.map((reservation, index) =>{
                return(
                <div  key={index} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">#{reservation.id}. {reservation.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{Moment(reservation.dateReservation).format('YYYY-MM-DD')}</h6>
                        <p className="card-text">{reservation.username}</p>
                        <NavLink className="btn btn-outline-secondary" to={{pathname: `/reservations/${reservation.id}`, query: {id: reservation.id}}}>Details</NavLink>
                        <button type="button" className="btn btn-success ms-2" onClick={() => this.confirmReservation(reservation.id)}>Confirm</button>                       
                        <button type="button" className="btn btn-warning ms-2" onClick={() => this.cancelReservation(reservation.id)}>Cancel</button>
                    </div>
                </div>
                )
            })}
            
            </section>
         );
    }

    searchBar(){
        return(
            <form className="d-flex justify-content-center mb-5">
                <div className="col-auto">
                    <p className="center-text mx-5">Find by username</p>
                </div>
                <div className="col-auto">
                    <label className="visually-hidden">Username</label>
                    <input type="text" className="form-control" placeholder="username" value={this.state.username} onChange={this.usernameHandler}/>
                </div>
                <div className="col-auto">
                    <button type="submit"  onClick={this.filterByUsername} className="btn btn-primary mb-3 mx-3" >Filter</button>
                </div>
            </form>
        )
    }
}
 
export default Reservation;