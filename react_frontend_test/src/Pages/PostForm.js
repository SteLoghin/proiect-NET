import React, { Component } from "react";
import axios from "axios";
import "../Style/postForm.css";
class PostForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Rooms: 0,
      Area: 0,
      Floor: 0,
      Year: 0,
      Bathrooms: 0,
      Kitchens: "",
      Zone: "",
    };
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);

    axios
      .get("http://localhost:5000/api/v1/predictions", {
        params: {
          rooms: this.state.Rooms,
          area: this.state.Area,
          floor: this.state.Floor,
          year: this.state.Year,
          bathrooms: this.state.Bathrooms,
          kitchens: this.state.Kitchens,
          zone: this.state.Zone,
        },
      })
      // .get('http://dotnethouse.azurewebsites.net/api/v1/predictions',this.state)
      .then((response) => {
        console.log(response);
        const data = JSON.parse(JSON.stringify(response));
        console.log("daaaaaa");
        console.log(data);
        document.getElementById("raspuns").textContent =
          "Estimated payment per month: " +
          (Math.round(data.data * 100) / 100).toFixed(2) +
          " euro";
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:5000/api/properties", {
        params: {
          rooms: this.state.Rooms,
          bathrooms: this.state.Bathrooms,
          zone: this.state.Zone

        },
      })
      .then((response) => {
        const pLinks = document.querySelector(".links");
        const divLinks = document.getElementById("links_show_list");
        console.log(response);
        const linkData = JSON.parse(JSON.stringify(response));
        let linksList = linkData.data.map(({ link }) => link);
        console.log("linkuri:", linksList, linksList.length);

        linksList=new Set(linksList);

        if (linksList.size) {
          pLinks.textContent = "";
          const divNew = document.createElement("div");
          divNew.id = "links_show_list";

          const pElement = document.getElementById("response");
          pElement.innerHTML="We found some links that match your desired house/apartment";

          //divNew.textContent = "We found some links to houses/apartments that match your prefferences. The price may vary.";
          let links_counter = 1
          linksList.forEach((element) => {
            const divLinksFinal = document.createElement("div");
            const a = document.createElement("a");
            a.appendChild(document.createTextNode(element));
            a.href = element;
            a.innerHTML = "Link " + links_counter;
            ++links_counter;
            a.target = "_blank";
            divNew.appendChild(divLinksFinal);

            const divLinksWithTextInside = document.createElement("div");
            divLinksFinal.appendChild(divLinksWithTextInside);

            divLinksWithTextInside.appendChild(a);
          });
          divLinks.parentElement.replaceChild(divNew, divLinks);
        }
      })

      .catch((error) => {
        const pLinks = document.querySelector(".links");
        const divLinks = document.getElementById("links_show_list");
        while(divLinks.lastElementChild){
			divLinks.removeChild(divLinks.lastElementChild);
		}
		pLinks.textContent = "Unfortunately we could not find any web link that matches your desired property yet.";
		divLinks.style.display="none";
        console.log(error);
      });
  };

  render() {
    const { rooms, area, floor, year, bathrooms, kitchens, zone } = this.state;
    return (
      <div className="body_and_links">

      <div className="body_page">
      <div className="centered_content">

      <div className="form_image">
        <div className="image_text">
          <p id="raspuns"></p>
        </div>
      </div>

      <div className="dataForm">
        <form onSubmit={this.submitHandler}>
          <h2>Where do you want to live in Iasi?</h2>
          <h3>We will show you how much $</h3>
          <div>
            <label>
              Rooms
              <br />
              <input className="form_input"
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
              Area - cubic meters
              <br />
              <input className="form_input"
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
              <input className="form_input"
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
              <input className="form_input"
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
              <input className="form_input"
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
              <input className="form_input"
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
              Name of the zone
              <br />
              <input className="form_input"
                type="text"
                name="Zone"
                id="Zone"
                value={zone}
                onChange={this.changeHandler}
              />
            </label>
          </div>

          <button type="submit" className="prediction_buton">Get a price!</button>
          

          
        </form>
      </div>
      </div>
      
      </div>
        <p className="links" id="response"></p>
        <div id="links_show_list"></div> 
      </div>
    );
  }
}

export default PostForm;
