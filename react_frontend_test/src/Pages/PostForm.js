import React, { Component } from 'react';
import axios from 'axios';
import '../Style/postForm.css';
class PostForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			Rooms: 0,
			Area: 0,
			Floor: 0,
			Year: 0,
			Bathrooms: 0,
			Kitchens: '',
			Zone: ''
		}
	}

	changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	submitHandler = e => {
		e.preventDefault()
		console.log(this.state);
		
		axios
		.get('http://localhost:5000/api/v1/predictions',{
			params:{
				rooms:this.state.Rooms,
				area:this.state.Area,
				floor:this.state.Floor,
				year:this.state.Year,
				bathrooms:this.state.Bathrooms,
				kitchens:this.state.Kitchens,
				zone:this.state.Zone,
			}
		})
			// .get('http://dotnethouse.azurewebsites.net/api/v1/predictions',this.state)
			.then(response => {
				console.log(response)
				const data=JSON.parse(JSON.stringify(response));
				console.log('daaaaaa');
				console.log(data);
				document.getElementById("raspuns").innerHTML="Estimated price is: "+ (Math.round(data.data * 100) / 100).toFixed(2);
			})
			.catch(error => {
				console.log(error)
			})
	}

	render() {
		const { rooms, area , floor, year, bathrooms, kitchens, zone} = this.state
		return (
			<div className="dataForm">
				<form onSubmit={this.submitHandler}>
					<h2>Spune-ne ce locuinta iti doresti</h2>
					<h3>Noi iti aratam pretul :)</h3>
					<div>
						<label >Rooms
						<br />
						<input
							type="number"
							name="Rooms"
							id="Rooms"
							value={rooms}
							onChange={this.changeHandler}
						/></label>
					</div>
					<div>
					<label>Area
					<br />
						<input
							type="number"
                            name="Area"
							value={area}
							onChange={this.changeHandler}
							id="lotConfig"
						/></label>
					</div>
					<div>
					<label>Floor <br />
						<input
							type="number"
							name="Floor"
							id="floor"
							value={floor}
							onChange={this.changeHandler}
						/></label>
					</div>
					<div>
					<label>Bathrooms
					<br />
						<input
							type="number"
                            name="Bathrooms"
							value={bathrooms}
							onChange={this.changeHandler}
							id="Bathrooms"
						/>
					</label>
					</div>
					<div>
					<label >Year
					<br />
						<input
							type="number"
                            name="Year"
                            id="Year"
							value={year}
							onChange={this.changeHandler}
						/>
					</label>
					</div>
					<div>
					<label>Kitchens
					<br />
						<input
							type="text"
                            name="Kitchens"
                            id="kitchens"
							value={kitchens}
							onChange={this.changeHandler}
						/>
					</label>
					</div>
					<div>
					<label>Zone
					<br />
						<input
							type="text"
                            name="Zone"
                            id="Zone"
							value={zone}
							onChange={this.changeHandler}
						/>
					</label>
					</div>
					
					<button type="submit">Trimite</button>
					<p id="raspuns"></p>
				</form>
				
			</div>
		)
	}
}

export default PostForm;