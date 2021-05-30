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
            console.log(res)
            if(res.status === 404){
                this.setState({notFound: true, errorMessage: res.message});
            }
            else{
                this.setState({user: res, notFound: false, ready: true})
            }       
        })
      }

  edit = (id) => {
    fetch(`${this.props.prefix}/api/library/admins/users/edit/${id}`,  {
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
        const {user, notFound, errorMessage} = this.state;
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
                <div class="card mt-1">
                    <div class="card-body">      
                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">First name</span>
                        </div>
                        <input type="text" className="form-control" value={user.firstName} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Last name</span>
                        </div>
                        <input type="text" className="form-control" value={user.lastName} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Address</span>
                        </div>
                        <input type="text" className="form-control" value={user.address} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Email</span>
                        </div>
                        <input type="text" className="form-control" value={user.email} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Phone</span>
                        </div>
                        <input type="text" className="form-control" value={user.phone} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend edit-icon">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Comment</span>
                        </div>
                        <input type="text" className="form-control" value={user.comment} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                    </div>

                    <button type="button" className="btn btn-outline-secondary">Back</button>
                    <button type="button" className="btn btn-success ms-2">Save</button>
                    </div>  
                </div>

                <h3 className="mt-5">Advanced</h3>
                <div class="card mt-1">
                    <div class="card-body">
                    <label for="basic-url">Books limit</label>
                        <div className="input-group mb-3">
                        <div className="input-group-prepend">
                        <button class="btn btn-success" type="button">Confirm</button>
                        </div>
                        <input type="text" className="form-control" value={user.maxBooks} id="basic-url" aria-describedby="basic-addon3"/>
                        </div>

                        <label for="banned">Is banned</label>
                        <div className="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {user.isBanned ? "Banned" : "Not Banned"}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                <a class="dropdown-item" href="#">Banned</a>
                                <a class="dropdown-item" href="#">Not Banned</a>
                            </div>
                        </div>
                    </div>
                </div>
      
                             
            </section>
         );
    }
}
 
export default withRouter(EditUser);