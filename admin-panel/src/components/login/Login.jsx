import React, { Component } from 'react';
import './login.css';
import {withRouter} from 'react-router-dom';

class Login extends Component {
    state = { 
       // prefix: "https://puz-biblioteka.herokuapp.com",
        username: "",
        password: "",
        error: false,
        message: ""
     }

    usernameHandler = (name) =>{
        this.setState({username: name.target.value});
    }

    passwordHandler = (pass) =>{
        this.setState({password: pass.target.value});
    }

    submitHandler = (e) => {
        e.preventDefault();
        let username = this.state.username;
        let password = this.state.password;
        let loginObject = {username, password};

        fetch(this.props.prefix + '/login',  {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
           body: JSON.stringify(loginObject) 
          })
          .then(response => {
              if(response.status === 200){
                const token = response.headers.get("authorization")
                this.props.setToken(token);
                this.setState({error: false, message: ""})
                this.goBack();
              }
              else if(response.status === 401){
                  this.setState({error: true, message: "Login failed!"});
              }
            
          });
      }

      goBack = () => {
        this.props.history.push('/');
      }

    render() { 
        const {message, username, password} = this.state;
        return ( 
            <section className="login-container ">
            <form className="card card-body login-card" onSubmit={this.submitHandler}>
                <div className="mb-3">
                    <label for="usernameInput1" className="form-label">Username</label>
                    <input type="text" className="form-control" id="usernameInput1" placeholder="username"  value={username} onChange={this.usernameHandler}/>
                </div>
                <div className="mb-3">
                    <label for="passwordInput1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="passwordInput1" placeholder="Password" value={password} onChange={this.passwordHandler}/>
                </div>
                <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
            <h3 className="text-center mt-2 text-danger">{message}</h3>
          </section>
         );
    }
}
 
export default withRouter(Login);