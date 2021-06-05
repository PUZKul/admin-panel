import React, { Component } from 'react';
import { NavLink} from 'react-router-dom';

class Users extends Component {
    state = {
        users: [],
        notFound: false,
        username: "",
        errorMessage: "",
        pagination: null
     }

    componentDidMount(){

        this.fetchUsers(0, 20, this.state.username);
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
                this.setState({pagination: res, notFound: false, users: res.content})
                this.updatePaginationBar();
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

  nextPage = () =>{
      if(this.state.pagination.last === false){
        var nextPage = this.state.pagination.currentPage + 1;
        if(this.state.pagination.totalPages - 1 === nextPage){
            const el1 = document.querySelector('#next-page');
            const el2 = document.querySelector('#li-next');
            el1.setAttribute("aria-disabled", true);
            el2.classList.add("disabled");
        }
        this.fetchUsers(nextPage, 20, this.state.username);
        
      }
  }

  previousPage = () =>{
    if(this.state.pagination.first === false){
      var previousPage = this.state.pagination.currentPage - 1;
      if(previousPage === 0){
          const el1 = document.querySelector('#previous-page');
          const el2 = document.querySelector('#li-previous');
          el1.setAttribute("aria-disabled", true);
          el2.classList.add("disabled");
      }
      this.fetchUsers(previousPage, 20, this.state.username);
      
    }
}

  updatePaginationBar = () =>{
    const pagination = document.querySelector('#pagination');

    const next_btn = document.querySelector('#next-page');
    const next_li = document.querySelector('#li-next');

    const prev_btn = document.querySelector('#previous-page');
    const prev_li = document.querySelector('#li-previous');

    if(this.state.pagination.totalPages === 1){
        pagination.classList.add("invisible")
    }
    else{
        pagination.classList.remove("invisible")
    }

    if(this.state.pagination.first === false){
        prev_btn.setAttribute("aria-disabled", false);
        prev_li.classList.remove("disabled");
    }

    if(this.state.pagination.last === false){
        next_btn.setAttribute("aria-disabled", false);
        next_li.classList.remove("disabled");
    }
  }

    render() { 
        
        const {users, notFound, errorMessage, pagination} = this.state;

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
                      <th scope="row">{index + 1 + (pagination.currentPage * 20) }</th>
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
            <ul className="pagination justify-content-center" id="pagination">
                <li className="page-item disabled" id="li-previous">
                    <button className="page-link" id="previous-page" onClick={() => this.previousPage()}>Previous</button>
                </li>
                <li class="page-item"><span className="page-link">{pagination.currentPage + 1}</span></li>
                <li className="page-item " id="li-next">
                    <button className="page-link" id="next-page" onClick={() => this.nextPage()}>Next</button>
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