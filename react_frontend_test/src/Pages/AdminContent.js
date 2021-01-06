import React, { Component } from "react";
import "../Style/AdminContent.css";
import axios from "axios";

class AdminContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Rooms: 0,
      Area: 0,
      Floor: 0,
      Year: 0,
      Bathrooms: 0,
      Kitchens: "",
      Link: "",
      Zone: "",
      Price: 0,
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);
    axios
      .post("http://localhost:5000/api/v1/properties", this.state)
      .then(console.log("da"));
  };
  render() {
    const {
      rooms,
      area,
      floor,
      year,
      bathrooms,
      kitchens,
      link,
      zone,
      price,
    } = this.state;
    return (
      <div className="admin-dashboard">
        <h1>(WIP)</h1>
        <h2> Ati intrat pe dashboard-ul de admin.</h2>{" "}
        <h2>Introduceti o noua locuinta:</h2>
        <div className="dataForm">
          <form onSubmit={this.submitHandler}>
            <div>
              <label>
                Rooms
                <br />
                <input
                  type="number"
                  name="Rooms"
                  id="Rooms"
                  value={rooms}
                  onChange={this.changeHandler}
                />
              </label>
            </div>
            <div>
              <label>
                Area
                <br />
                <input
                  type="number"
                  name="Area"
                  value={area}
                  onChange={this.changeHandler}
                  id="lotConfig"
                />
              </label>
            </div>
            <div>
              <label>
                Floor <br />
                <input
                  type="number"
                  name="Floor"
                  id="floor"
                  value={floor}
                  onChange={this.changeHandler}
                />
              </label>
            </div>
            <div>
              <label>
                Bathrooms
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
              <label>
                Year
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
              <label>
                Kitchens
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
              <label>
                Link
                <br />
                <input
                  type="text"
				  id="Link"
				  name="Link"
                  value={link}
                  onChange={this.changeHandler}
                />
              </label>
            </div>
            <div>
              <label>
                Zone
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
            <div>
              <label>
                Price
                <br />
                <input
                  type="number"
                  name="Price"
                  id="Price"
                  value={price}
                  onChange={this.changeHandler}
                />
              </label>
            </div>
            <button className="post-button" type="submit">
              Adauga
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AdminContent;
