import React, { Component } from 'react';
import { NavLink} from 'react-router-dom';

class Users extends Component {
    state = {
        users: [],
        notFound: false,
        username: "",
        errorMessage: "",
        page: 1
     }

    componentDidMount(){
        this.fetchUsers(0, 25, this.state.username);
    }
     
    fetchUsers = (page, limit, username) =>{
        fetch(this.props.prefix + `/api/library/admins/users?page=${page}&limit=${limit}&username=${username}`, {
        method: 'GET',
        headers: {"Content-Type": "application/json", "Authorization": this.props.getToken()}
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 404){
                this.setState({notFound: true, errorMessage: res.message});
            }
            else if (res.status == 403){
                this.setState({notFound: true, errorMessage: "You have to login to administrator account to get access to this resource"})
            }
            else{
                this.setState({users: res, notFound: false})
            }       
        })
  }

  usernameHandler = (name) =>{
    this.setState({username: name.target.value});
}   

  filterByUsername = (e) =>{
    e.preventDefault();
    this.fetchUsers(0, 20, this.state.username);
  }

    render() { 
        
        const {users, notFound, errorMessage, page} = this.state;

        if(!users.length && notFound===false){
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

            <table className="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Username</th>
                    <th scope="col">Full name</th>
                    <th scope="col" >Address</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Email</th>
                    <th scope="col">Book limit</th>
                    <th scope="col">Warnings</th>
                    <th scope="col">Role</th>
                    <th scope="col">isBanned</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead> 
            <tbody >
            {this.state.users.map((user, index) =>{
                return(
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.username}</td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td ><span className="cutText address">{user.address}</span></td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.maxBooks}</td>
                      <td>{user.warnings}</td>
                      <td>{user.role}</td>
                      <td>{user.banned? "Yes" : "No"}</td>
                      <td><NavLink className="btn btn-success" to={{pathname: `/users/${user.id}`, query: {id: user.id}}}>Edit</NavLink></td>
                    </tr>             
                )
            })}

            </tbody>
            </table>

            <div >
            <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                    <button className="page-link" aria-disabled="true">Previous</button>
                </li>
                <li class="page-item"><span className="page-link">{page}</span></li>
                <li className="page-item ">
                    <button className="page-link" aria-disabled="true">Next</button>
                </li>
            </ul>
            </div>

            </section>
         );
    }

    searchBar(){
        return(
            <form className="d-flex justify-content-center mb-5" onClick={this.filterByUsername}>
                <div className="col-auto">
                    <p className="center-text mx-5">Find by username</p>
                </div>
                <div className="col-auto">
                    <label className="visually-hidden">Username</label>
                    <input type="text" className="form-control" placeholder="username" value={this.state.username} onChange={this.usernameHandler}/>
                </div>
                <div className="col-auto">
                    <button type="submit"   className="btn btn-primary mb-3 mx-3" >Filter</button>
                </div>
            </form>
        )
    }
}
 
export default Users;