import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Moment from 'moment';
import { NavLink} from 'react-router-dom';

class Details extends Component {
    state = { 
        id: 0,
        ready: false,
        notFound: false,
        errorMessage: "",
        reservation: null,
        user: null
     }

     componentDidMount(){
        const url = this.props.location.pathname;
        const array = url.split('/');
        const _id = array[array.length-1];

        this.fetchReservation(_id);
        
        this.setState({id: _id});
     }

  fetchReservation = (id) =>{
    fetch(this.props.prefix + `/api/library/admins/reservations/${id}`, {
       method: 'GET',
       headers: {"Content-Type": "application/json", "Authorization": this.props.getToken()}
      })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        if(res.status === 404){
            this.setState({notFound: true, errorMessage: res.message});
        }
        else{
            this.fetchUser(res.userId);
            this.setState({reservation: res, notFound: false})
        }       
    })
  }

  fetchUser= (id) =>{
    fetch(this.props.prefix + `/api/library/admins/users/${id}`, {
       method: 'GET',
       headers: {"Content-Type": "application/json", "Authorization": this.props.getToken()}
      })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        if(res.status === 404){
            this.setState({notFound: true, errorMessage: res.message});
        }
        else{
            this.setState({user: res, notFound: false, ready: true})
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
          console.log(res);
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
          console.log(res);
          if(res.status === 200){
              alert("Reservation canceled");
              let filteredArray = this.state.reservations.filter(e => e.id !== id);
              this.setState({reservations: filteredArray});
          }
      });
  }

    render() { 
        const {reservation, user, notFound, errorMessage} = this.state;
        if((reservation === null || user === null) && notFound===false){
            return (<div>Loading...</div>)
        }
        else if(notFound === true){
            return (
                <section>
                    <div><b>{errorMessage}</b></div> 
                </section>
            )
        }
            return ( 
                <section className="card">         
                    <div className="card-body">
                            <h5 className="card-title"> {reservation.title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Reservation ID: #{reservation.id} </h6>
                            <p className="card-text"><b>Username: </b>{reservation.username}</p>
                            <p className="card-text"><b>Full name:</b> {user.firstName} {user.lastName}</p>
                            <p className="card-text"><b>Email: </b>{user.email}</p>
                            <p className="card-text"><b>Phone: </b>{user.phone}</p>
                            <p className="card-text"><b>Issue date: </b>{Moment(reservation.dateReservation).format('YYYY-MM-DD')}</p>
                            <NavLink className="btn btn-outline-secondary" to="/reservations">Back</NavLink>
                            <button type="button" className="btn btn-success ms-2" onClick={() => this.confirmReservation(reservation.id)}>Confirm</button>
                            <button type="button" className="btn btn-warning ms-2" onClick={() => this.cancelReservation(reservation.id)}>Cancel</button>
                        </div>
                </section>
            );
    }
}
 
export default withRouter(Details);