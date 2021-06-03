import React, { Component } from 'react';
import Moment from 'moment';
import { withRouter } from 'react-router-dom'

class Request extends Component {
    state = {
        requests: [],
        username: "",
        notFound: false,
        errorMessage: "",
        comment: "",
        limit: "",
        username: "",
        page: 1
     }

    componentDidMount(){
        this.fetchRequests(0, 10, this.state.username);
    }
     

    fetchRequests = (page, limit, username) =>{
    fetch(this.props.prefix + `/api/library/admins/requests?page=${page}&limit=${limit}&username=${username}`, {
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
            this.setState({requests: res, notFound: false})
        }       
    })
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
    this.fetchRequests(0, 10, this.state.username);
  }

  gotToUser = (name) =>{
    fetch(`${this.props.prefix}/api/library/admins/users/getUserId/${name}`,  {
        method: 'GET',
        headers: {
         "Content-Type": "application/json",
         "Authorization": this.props.getToken()
     }
       })
       .then(res => res.json())
       .then(res => {
        this.props.history.push('/users/'+res)
        
       });
  }

  getEditLimitObject = () =>{
    let limit = this.state.limit < 1 ? 3 : this.state.limit;
    let comment = this.state.comment;
    return {limit, comment};
  }

    increaseLimit = () =>{
    fetch(`${this.props.prefix}/api/library/admins/users/${this.state.username}/bookLimit`,  {
        method: 'POST',
        body: JSON.stringify(this.getEditLimitObject()),
        headers: {
         "Content-Type": "application/json",
         "Authorization": this.props.getToken()
     }
       })
       .then(res => {
           if(res.status === 200){
              // confirmRequest();
               alert("Limit changed successfully");

           }
       });
  }

  cancelRequest = (id) =>{
    fetch(`${this.props.prefix}/api/library/admins/requests/reject/${id}`,  {
        method: 'POST',
        headers: {
         "Content-Type": "application/json",
         "Authorization": this.props.getToken()
     }
       })
       .then(res => {
        if(res.status === 200){
            alert("Request rejected");
            this.setState({notFound: false, errorMessage: ""});
        }
        else{
            this.setState({notFound: true, errorMessage: res.message});
        }
           
       });
  }

  dataHandler = (e) =>{
    this.setState({[e.target.name]: e.target.value});
}  

setUsername = (username) =>{
    this.setState({username: username});
}

    render() { 
        const {requests, notFound, errorMessage, page,} = this.state;
        if(!requests.length && notFound===false){
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
            {this.state.requests.map((request, index) =>{
                return(
                <div  key={index} className="lib-card card-hover shadow-sm  p-3 mb-3 bg-white rounded">
                    <div className="card-body">
                        <h5 className="card-title">#{request.id}. {request.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{request.author}</h6>
                        <p className="card-text">{request.message}</p>
                        <p className="card-text">Date: <i>{Moment(request.date_issued).format('YYYY-MM-DD')}</i></p>
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" onClick={() => this.setUsername(request.author)} data-bs-target="#exampleModal">
                            Increase limit
                        </button>
                        <button type="button" className="btn btn-success ms-2" onClick={() => this.gotToUser(request.author)}>Visit user</button>                       
                        <button type="button" className="btn btn-warning ms-2" onClick={() => this.cancelRequest(request.id)}>Reject</button>
                    </div>
                </div>
                )
            })}

            {this.popup()}
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

    popup(){
        const {limit, comment} = this.state;
        return(
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Limit</span>
                        </div>
                        <input type="number" name="limit" className="form-control" value={limit} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>
                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Comment</span>
                        </div>
                        <input type="text" name="comment" className="form-control" value={comment} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => this.increaseLimit()}>Save changes</button>
                </div>
                </div>
            </div>
            </div>
        )
    }
}
 
export default withRouter(Request);