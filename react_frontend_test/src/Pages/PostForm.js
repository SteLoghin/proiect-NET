import React, { Component } from 'react'
import axios from 'axios'
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
			<div>
				<form onSubmit={this.submitHandler}>
					<div>
						<input
							type="number"
                            name="lotArea"
                            placeholder="lotArea"
							value={lotArea}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="text"
                            name="lotConfig"
                            placeholder="lotConfig"
							value={lotConfig}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="text"
                            name="zone"
                            placeholder="zone"
							value={zone}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="text"
                            name="floors"
                            placeholder="floors"
							value={floors}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="number"
                            name="overallCond"
                            placeholder="overallCond"
							value={overallCond}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="number"
                            name="yearBuilt"
                            placeholder="yearBuilt"
							value={yearBuilt}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="number"
                            name="rooms"
                            placeholder="rooms"
							value={rooms}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="text"
                            name="saleCondition"
                            placeholder="saleCondition"
							value={saleCondition}
							onChange={this.changeHandler}
						/>
					</div>
					<div>
						<input
							type="number"
                            name="salePrice"
                            placeholder="salePrice"
							value={salePrice}
							onChange={this.changeHandler}
						/>
					</div>
					<button type="submit">Predict</button>
				</form>
				<p id="raspuns"></p>
			</div>
		)
	}
}

export default PostForm;