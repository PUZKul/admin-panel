import React, { Component } from 'react';
import Moment from 'moment';
class Reservation extends Component {
    state = {
        prefix: "https://puz-biblioteka.herokuapp.com",
        token: "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJibGFja2xpc3Q6d3JpdGUifSx7ImF1dGhvcml0eSI6ImJvcnJvdzp3cml0ZSJ9LHsiYXV0aG9yaXR5IjoidXNlcnM6cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYm9va19jb3B5OndyaXRlIn0seyJhdXRob3JpdHkiOiJib29rX2NvcHk6cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYm9va3M6cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYmxhY2tsaXN0OnJlYWQifSx7ImF1dGhvcml0eSI6ImJvcnJvdzpyZWFkIn0seyJhdXRob3JpdHkiOiJyZXNlcnZhdGlvbjp3cml0ZSJ9LHsiYXV0aG9yaXR5IjoiYm9va3M6d3JpdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifSx7ImF1dGhvcml0eSI6InJlc2VydmF0aW9uOnJlYWQifSx7ImF1dGhvcml0eSI6InVzZXJzOndyaXRlIn1dLCJpYXQiOjE2MjExNzI2MjMsImV4cCI6MTYyMzcwODAwMH0.KsBMPpCwZLo65uB06l8-DibCCe430yuBh9WTbG1AvuE9k3x7M6jY2XmcMDRNa56F", 
        reservations: []
     }

    componentDidMount(){
    this.fetchReservations();
    }
     
  fetchReservations = () =>{
    fetch(this.state.prefix + '/api/library/admins/reservations', {
       method: 'GET',
       headers: {"Content-Type": "application/json", "Authorization": this.state.token}
      })
    .then(res => res.json())
    .then(res => {
        console.log(res)
      this.setState({reservations: res})

    });
  }

  confirmReservation = (id) => {
    fetch(`${this.state.prefix}/api/library/admins/confirmBorrow/${id}`,  {
       method: 'POST',
       headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.token
    }
      })
      .then(res => {
          console.log(res);
          if(res.status == 200){
              alert("Reservation confirmed");
          }
          //delete this element from list
      })
  }

  cancelReservation = (id) => {
    fetch(`${this.state.prefix}/api/library/admins/reservations/cancel/${id}`,  {
       method: 'POST',
       headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.token
    }
      })
      .then(res => {
          console.log(res);
          if(res.status == 200){
              alert("Reservation canceled");
          }
          //delete this element from list
      })
  }

    render() { 
        const {reservations} = this.state;
        if(!reservations.length){
            return (<div>Loading...</div>)
        }
        return ( 
            <section>
            
            {this.state.reservations.map((reservation, index) =>{
                return(
                <div  key={index} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">#{reservation.id}. {reservation.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{Moment(reservation.dateReservation).format('YYYY-MM-DD')}</h6>
                        <p className="card-text">{reservation.userId}</p>
                        <button type="button" className="btn btn-success" onClick={() => this.confirmReservation(reservation.id)}>Confirm</button>
                        <button type="button" className="btn btn-warning mx-3" onClick={() => this.cancelReservation(reservation.id)}>Cancel</button>
                    </div>
                </div>
                )
            })}
            
            </section>
         );
    }
}
 
export default Reservation;