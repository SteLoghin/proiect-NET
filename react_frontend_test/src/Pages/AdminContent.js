import React, { Component } from "react";
import "../Style/AdminContent.css";
import axios from 'axios';

class AdminContent extends Component {
	
	submitHandler = e => {
		e.preventDefault()
		console.log(this.state)
		axios
		.get('http://localhost:5000/api/v1/admin/properties')
			// .get('http://dotnethouse.azurewebsites.net/api/v1/predictions',this.state)
			.then(response => {
				console.log("daaa");
				console.log(response)
				const data=JSON.parse(JSON.stringify(response))
				// console.log(typeof(data.data));
				console.log(data)
				document.getElementById("raspuns-admin").innerHTML=(Math.round(data.data * 100) / 100).toFixed(2);
			})
			.catch(error => {
				console.log(error)
			})
	}
  render() {
    return (
      <div className="admin-dashboard">
        <h1>(WIP)</h1>
		<h2> Ati intrat pe dashboard-ul de admin.</h2>{" "}
		{/* <button onClick={this.submitHandler}>Apasa</button>
		<p id="raspuns-admin"></p> */}
        <table id="houses-data">
			<thead>
				<tr>
					<th>Zone</th>
					<th>Area</th>
					<th>Rooms</th>
					<th>Bathrooms</th>
					<th>Parking Lots</th>
					<th>Floor</th>
					<th>Animal</th>
					<th>Furnished</th>
				</tr>	
			</thead>
			<tbody>
			
			</tbody>	
		</table>{" "}
		
	  </div>
    );
  }
}

export default AdminContent;
