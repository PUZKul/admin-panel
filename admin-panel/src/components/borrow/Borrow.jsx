import React, { Component } from 'react';
import Moment from 'moment';

class Borrow extends Component {
    state = {
        borrow: [],
        username: "",
        notFound: false,
        errorMessage: "",
     }

    componentDidMount(){
        this.fetchBorrow(0, 15, this.state.username);
    }
     

    fetchBorrow = (page, limit, username) =>{
    fetch(this.props.prefix + `/api/library/admins/rental?page=${page}&limit=${limit}&username=${username}`, {
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
            this.setState({borrow: res, notFound: false})
        }       
    })
  }


  confirmReturn = (id) => {
    fetch(`${this.props.prefix}/api/library/admins/confirmReturn/${id}`,  {
       method: 'POST',
       headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.getToken()
    }
      })
      .then(res => {
          if(res.status === 200){
              alert("Book returned");
              let filteredArray = this.state.borrow.filter(e => e.id !== id);
              this.setState({borrow: filteredArray});
          }
      });
  }

  extend = (id) => {
    // fetch(`${this.props.prefix}/api/library/admins/rental/extend/${id}`,  {
    //    method: 'POST',
    //    headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": this.props.getToken()
    // }
    //   })
    //   .then(res => {
    //       if(res.status === 200){
    //           alert("Book extended");
    //           
    //       }
    //   });
  }

  usernameHandler = (name) =>{
    this.setState({username: name.target.value});
}   

  filterByUsername = (e) =>{
    e.preventDefault();
    this.fetchBorrow(0, 10, this.state.username);
  }

    render() { 
        const {borrow, notFound, errorMessage} = this.state;
        if(!borrow.length && notFound===false){
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
            {this.state.borrow.map((borrow, index) =>{
                return(
                <div  key={index} className="lib-card card-hover shadow-sm p-3 mb-3 bg-white rounded">
                    <div className="card-body">
                        <h5 className="card-title">#{borrow.id}. {borrow.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{Moment(borrow.dateIssued).format('YYYY-MM-DD')}</h6>
                        <p className="card-text">{borrow.username}</p>
                        {/* <NavLink className="btn btn-outline-secondary" to={{pathname: `/rental/${borrow.id}`, query: {id: borrow.id}}}>Details</NavLink> */}
                        <button type="button" className="btn btn-success" onClick={() => this.confirmReturn(borrow.id)}>Confirm</button>                       
                        <button type="button" className="btn btn-warning ms-2" onClick={() => this.extend(borrow.id)}>Extend</button>
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
 
export default Borrow;