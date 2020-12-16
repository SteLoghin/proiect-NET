import React, { Component } from 'react';
import axios from 'axios';
import '../Style/postForm.css';
class PostForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			Zone:'',
			Area:0,
			Rooms:0,
			Bathrooms:0,
			ParkingLots:0,
			Floor:0,
			Animal:0,
			Furnished:''
		}
	}

	changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	submitHandler = e => {
		e.preventDefault()
		console.log(this.state)
		axios
			.get('http://dotnethouse.azurewebsites.net/api/v1/predictions',this.state)
			.then(response => {
				console.log(response)
				const data=JSON.parse(JSON.stringify(response))
				console.log(data)
				document.getElementById("raspuns").innerHTML="Estimated price is: "+ data.data;
			})
			.catch(error => {
				console.log(error)
			})
	}

	render() {
		const { zone,area,rooms,bathrooms,parkingLots,floor,animal,furnished} = this.state
		return (
			<div className="dataForm">
				<form onSubmit={this.submitHandler}>
					<h2>Spune-ne ce locuinta iti doresti</h2>
					<h3>Noi iti aratam pretul :)</h3>
					<div>
						<label >Zone
						<br />
						<input
							type="text"
							name="Zone"
							id="Zone"
							value={zone}
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
					<label>Rooms <br />
						<input
							type="number"
							name="Rooms"
							id="Rooms"
							value={rooms}
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
					<label >Parking Lots
					<br />
						<input
							type="number"
                            name="ParkingLots"
                            id="ParkingLots"
							value={parkingLots}
							onChange={this.changeHandler}
						/>
					</label>
					</div>
					<div>
					<label>Floor
					<br />
						<input
							type="number"
                            name="Floor"
                            id="Floor"
							value={floor}
							onChange={this.changeHandler}
						/>
					</label>
					</div>
					<div>
					<label>Animal
					<br />
						<input
							type="text"
                            name="Animal"
                            id="Animal"
							value={animal}
							onChange={this.changeHandler}
						/>
					</label>
					</div>
					<div>
					<label>Furnished
					<br />
						<input
							type="text"
                            name="Furnished"
                            id="Furnished"
							value={furnished}
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