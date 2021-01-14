import React, { Component } from 'react';
import '../Style/AdminLogin.css';
require('dotenv').config('../../.env');
// console.log(process.env)
// import { NavLink } from 'react-router-dom';


class AdminPage extends Component {
    constructor(props) {
		super(props)

		this.state = {
			
		}
	}

    changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value })
	}
	
    
    submitHandler = e => {
		e.preventDefault()
		console.log(this.state)
		const name=document.getElementById("login").value
		const password=document.getElementById("password").value
		if(name===process.env.REACT_APP_ADMIN_NAME && password===process.env.REACT_APP_ADMIN_PASSWORD){
			this.props.history.push("/admin-dashboard")
		}else{
			alert("Invalid username or password")
		}
	}


	render() {
		return (
			<React.Fragment>
                <div className="wrapper fadeInDown">
                <div id="formContent">
                <div className="fadeIn first">
                    <h2 className="admin-title">Admin</h2>
                    <img src="https://img.icons8.com/bubbles/100/000000/admin-settings-male.png" id="icon" alt="UserIcon" />
                   
                </div>

                <form onSubmit={this.submitHandler}>
                    <input type="text" id="login" className="inpt-field" name="login" placeholder="name" />
                    <input type="password" id="password" className="inpt-field" name="login" placeholder="password" />
                    <input type="submit" className="inpt-field inpt-button" value="LogIn"/>
                </form>

                </div>
                </div>
            </React.Fragment>

		)
	}
}

export default AdminPage;