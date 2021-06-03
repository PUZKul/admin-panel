import React, { Component } from 'react';
import { NavLink} from 'react-router-dom';
import { withRouter } from 'react-router-dom'


class EditUser extends Component {
    state = {
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        phone: "",
        bookLimit: 3,
        notFound: false,
        errorMessage: "",
        user: null
     }

    componentDidMount(){
        const url = this.props.location.pathname;
        const array = url.split('/');
        const _id = array[array.length-1];

        this.fetchUser(_id);
        this.setState({id: _id});
    }
     

    fetchUser= (id) =>{
        fetch(this.props.prefix + `/api/library/admins/users/${id}`, {
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
                this.setState({user: res, notFound: false, ready: true})
                this.setState({id: res.id, email: res.email, comment: res.comment, firstName: res.firstName, lastName: res.lastName, address: res.address, phone: res.phone, bookLimit: res.maxBooks});
            }       
        })
      }

  edit = () => {
    console.log("here");
    console.log(this.getEditUserObject());

    fetch(`${this.props.prefix}/api/library/admins/users/edit/${this.state.user.username}`,  {
       method: 'POST',
       body: JSON.stringify(this.getEditUserObject()),
       headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.getToken()
    }
      })
      .then(res => {
          if(res.status === 200){
              alert("Data changed successfully");
          }
      });
  }

  increaseLimit = () =>{
    fetch(`${this.props.prefix}/api/library/admins/users/${this.state.user.username}/bookLimit`,  {
        method: 'POST',
        body: JSON.stringify(this.getEditLimitObject()),
        headers: {
         "Content-Type": "application/json",
         "Authorization": this.props.getToken()
     }
       })
       .then(res => {
           if(res.status === 200){
               alert("Limit changed successfully");
           }
       });
  }

  getEditUserObject = () =>{
    let firstName = this.state.firstName === this.state.user.firstName? "" : this.state.firstName;
    let lastName = this.state.lastName === this.state.user.lastName? "" : this.state.lastName;
    let phone = this.state.phone === this.state.user.phone? "" : this.state.phone;
    let address = this.state.address === this.state.user.address? "" : this.state.address;
    let email = this.state.email === this.state.user.email? "" : this.state.email;
    let comment = this.state.comment === this.state.user.comment? "" : this.state.comment;

    return {firstName, lastName, phone, address, email, comment};
  }

  getEditLimitObject = () =>{
    let limit = this.state.bookLimit < 1 ? 3 : this.state.bookLimit

    return {limit};
  }

  dataHandler = (e) =>{
    this.setState({[e.target.name]: e.target.value});
}   

  filterByUsername = (e) =>{
    e.preventDefault();
    this.fetchBorrow(0, 10, this.state.username);
  }

   myFunction = () => {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  goBack = () => {
      this.props.history.goBack();
    //this.props.history.push('/users');
  }

  activate = () =>{

    fetch(`${this.props.prefix}/api/library/admins/users/${this.state.user.username}/activate`,  {
        method: 'GET',
        headers: {
         "Authorization": this.props.getToken()
     }
       })
       .then(res => {
           if(res.status === 200){
               alert("User account activated");
               this.setState(prevState => ({user: {...prevState.user, banned: false}}));
           }
       });
  }

  deactivate = () =>{
   
  fetch(`${this.props.prefix}/api/library/admins/users/${this.state.user.username}/deactivate/User banned by administrator`,  {
      method: 'GET',
      headers: {
       "Authorization": this.props.getToken()
   }
     })
     .then(res => {
         if(res.status === 200){
             alert("User account deactivated");
             this.setState(prevState => ({user: {...prevState.user, banned: true}}));
         }
     });
}

    render() { 
        const {user, notFound, errorMessage, firstName, lastName, phone, address, comment, email, bookLimit} = this.state;
        if(user === null && notFound===false){
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
            <section className="">
                <h3>Edit <b> {user.username} </b> account</h3>   
                <div className="card mt-1">
                    <div className="card-body">      
                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">First name</span>
                        </div>
                        <input type="text" name="firstName" className="form-control" value={firstName} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Last name</span>
                        </div>
                        <input type="text" name="lastName" className="form-control" value={lastName} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Address</span>
                        </div>
                        <input type="text" name="address" className="form-control" value={address} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Email</span>
                        </div>
                        <input type="text" name="email" className="form-control" value={email} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Phone</span>
                        </div>
                        <input type="text" name="phone" className="form-control" value={phone} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Comment</span>
                        </div>
                        <input type="text" name="comment" className="form-control" value={comment} aria-label="Small" onChange={this.dataHandler} aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <button type="button" className="btn btn-outline-secondary" onClick={() => this.goBack()}>Back</button>
                    <button type="button" className="btn btn-success ms-2" onClick={() => this.edit()}>Save</button>
                    </div>  
                </div>

                <h3 className="mt-5">Advanced</h3>
                <div className="card mt-1">
                    <div className="card-body">
                    <label for="basic-url">Books limit</label>
                        <div className="input-group mb-3">
                        <div className="input-group-prepend">
                        <button className="btn btn-success" type="button" onClick={() => this.increaseLimit()}>Confirm</button>
                        </div>
                        <input type="number" name="bookLimit" className="form-control" value={bookLimit} onChange={this.dataHandler} id="basic-url" aria-describedby="basic-addon3"/>
                        </div>

                        <label>Is active</label>
                        <div>
                        {
                        user.banned? 
                            <button type="button" className="btn btn-warning" onClick={() => this.activate()}>Activate account</button>
                            :
                            <button type="button" className="btn btn-danger" onClick={() => this.deactivate()}>Deactivate account</button>
                        }
                        </div>
                    </div>
                </div>
      
                             
            </section>
         );
    }
}
 
export default withRouter(EditUser);