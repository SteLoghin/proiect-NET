import React, { Component } from 'react';
import axios from 'axios';
import '../Style/postForm.css';
class PostForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lotArea:0,
			lotConfig:'',
			zone:'',
			floors:'',
			overallCond:0,
			yearBuilt:0,
			rooms:0,
			saleCondition:'',
			salePrice:0
		}
	}

	changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	submitHandler = e => {
		e.preventDefault()
		console.log(this.state)
		axios
			//.post('http://localhost:5000/api/v1/predictions', this.state)
			.post('http://dotnethouse.azurewebsites.net/api/v1/predictions', this.state)
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
		const { lotArea,lotConfig,zone,floors,overallCond,yearBuilt,rooms,saleCondition,salePrice } = this.state
		return (
			<div className="dataForm">
				<form onSubmit={this.submitHandler}>
					<h2>Spune-ne ce locuinta iti doresti</h2>
					<h3>Noi iti aratam pretul :)</h3>
					<div>
						<label for="lotArea">Lot Area</label><br />
						<input
							type="number"
							name="lotArea"
							id="lotArea"
                            placeholder="Lot Area"
							value={lotArea}
							onChange={this.changeHandler}
							
						/>
					</div>
					<div>
					<label for="lotConfig">Lot Config</label><br />
						<input
							type="text"
                            name="lotConfig"
							value={lotConfig}
							onChange={this.changeHandler}
							id="lotConfig"
						/>
					</div>
					<div>
					<label for="zone">Zone</label><br />
						<input
							type="text"
							name="zone"
							id="zone"
							value={zone}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
					<label for="floors">Floors</label><br />
						<input
							type="text"
                            name="floors"
							value={floors}
							onChange={this.changeHandler}
							id="floors"
						/>
					</div>
					<div>
					<label for="overallCond">Overall Condition</label><br />
						<input
							type="number"
                            name="overallCond"
                            id="overallCond"
							value={overallCond}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
					<label for="yearBuilt">Year Built</label><br />
						<input
							type="number"
                            name="yearBuilt"
                            id="yearBuilt"
							value={yearBuilt}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
					<label for="rooms">Rooms</label><br />
						<input
							type="number"
                            name="rooms"
                            id="rooms"
							value={rooms}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
					<label for="saleCondition">Sale Condition</label><br />
						<input
							type="text"
                            name="saleCondition"
                            id="saleCondition"
							value={saleCondition}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
					<label for="salePrice">Sale Price</label><br />
						<input
							type="number"
                            name="salePrice"
                            id="salePrice"
							value={salePrice}
							onChange={this.changeHandler}
						/>
					</div>
					<button type="submit">Trimite</button>
					<p id="raspuns"></p>
				</form>
				
			</div>
		)
	}
}

export default PostForm;