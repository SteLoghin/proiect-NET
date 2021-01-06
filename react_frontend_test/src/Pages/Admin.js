import React, { Component } from 'react';
import '../Style/AdminLogin.css';
import axios from 'axios';
// import { NavLink } from 'react-router-dom';


class AdminPage extends Component {
    constructor(props) {
		super(props)

		this.state = {
			Rooms: 2,
			Area: 2,
			Floor: 2,
			Year: 2,
			Bathrooms: 2,
			Kitchens: "Yes",
			Zone: "Copou",
		  };
	}

    changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value })
    }
    
    submitHandler = e => {
		e.preventDefault()
		console.log(this.state)
		axios
		.get('http://localhost:5000/api/v1/predictions')
			// .get('http://dotnethouse.azurewebsites.net/api/v1/predictions',this.state)
			.then(response => {
				console.log(response.status)
				const data=JSON.parse(JSON.stringify(response))
				console.log(data)
                if(response.status === 200){
                    console.log("here");
                    this.props.history.push("/admin-dashboard")
                }
			})
			.catch(error => {
				console.log(error)
			})
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
                    <input type="text" id="login" className="inpt-field" name="login" placeholder="login" />
                    <input type="text" id="password" className="inpt-field" name="login" placeholder="password" />
                    <input type="submit" className="inpt-field inpt-button" value="LogIn"/>
                </form>

                </div>
                </div>
            </React.Fragment>

		)
	}
}

export default AdminPage;