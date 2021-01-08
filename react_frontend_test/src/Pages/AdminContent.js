import React, { Component } from "react";
import "../Style/AdminContent.css";
import axios from "axios";

class AdminContent extends Component {
  static errors = {};
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

  successfullyAdded = () => {
    const addded = document.getElementById("added");
    addded.textContent =
      "Proprietatea a fost adaugata cu succes in baza de date!";
  };

  displayCrawlerStats = () => {
    // console.log("cevaaa");
    const showStats = document.getElementById("crawler-stats");
    showStats.textContent = "Asteptam raspunsul de la server...";
    axios
      .get("http://localhost:5000/api/v1/admin/crawling-stats")
      .then((response) => {
        // console.log(response);
        showStats.textContent = "";
        // TODO posibil, in caz ca o sa mai faca crawl pe alte site-uri, voi modifica aici cu o functie ca sa nu para ca e "hardcodat" titirez din json
        const data = JSON.parse(JSON.stringify(response.data[0].titrez));
        // console.log("data=", data);
        const numberOfNewProperties = data.length;
        const totalCrawlTime = JSON.stringify(data.total_crawl_time).split(
          "."
        )[0];
        const crawlDate = data.last_crawl_datetime.split(" ");
        const lastCrawlHour = crawlDate[1].split(".")[0];
        showStats.textContent = `Ultimul crawl pe site-ul titirez.ro a durat ${totalCrawlTime} secunde, a avut loc in data de ${crawlDate[0]} la ora ${lastCrawlHour} si au fost adaugate ${numberOfNewProperties} proprietati noi in baza de date.`;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  startCrawlerRequest = () => {
    const crawlerStart = document.getElementById("crawler-start");
    crawlerStart.textContent = "Asteptam raspunsul de la server...";
    console.log("start crawler");
    axios
      .post("http://localhost:5000/api/v1/admin/start-crawler")
      .then((response) => {
        crawlerStart.textContent = "Crawlerul a pornit de la prima cheie";
      })
      .catch((error) => {
        crawlerStart.textContent = "Mai baga o cheie";
      });
  };

  renewTrainingDataRequest = () => {
    const text = document.getElementById("renew-training-data");
    text.textContent = "Asteptam raspunsul de la server...";
    axios
      .post("http://localhost:5000/api/v1/admin/renew-training-data")
      .then((response) => {
        text.textContent =
          "Datele au fost innoite cu succes!(Datele noi de la crawler au fost adaugate in baza de date pentru antrenarea modelului.)";
      })
      .catch((error) => {
        text.textContent = "Eroare de la server, incercati mai tarziu.";
      });
  };

  fetchProperties = () => {
    axios
      .get("http://localhost:5000/api/properties")
      .then((response) => {
        const propertiesList = response.data;
        // console.log(propertiesList);
        const tableParent = document.getElementById("get-properties");
        const propertiesTable = document.createElement("table");
        tableParent.appendChild(propertiesTable);
        const tableHead = document.createElement("thead");
        const firstRow = document.createElement("tr");
        let keys = Object.keys(propertiesList[0]);
        // console.log(keys);
        for (let i = 1; i < keys.length; i++) {
          const atribut = document.createElement("th");
          atribut.appendChild(document.createTextNode(keys[i]));
          firstRow.appendChild(atribut);
        }
        tableHead.appendChild(firstRow);
        propertiesTable.appendChild(tableHead);
        // const tableBody=document.createElement("tbody");
        // dam la urma append la tableBody la tabel
        // cream elementele din tabel
        propertiesList.forEach((property) => {
          const tr = document.createElement("tr");
          // for(let [key,value] of Object.entries(property)){
          //   if(key==="id"){
          //     continue;
          //   }
          //   const atribut=document.createElement("td");
          //   atribut.appendChild(document.createTextNode(property[key]));
          // }
          for (let i = 1; i < keys.length; i++) {
            const atribut = document.createElement("td");
            // console.log("----------------", property[keys[i]]);
            atribut.appendChild(document.createTextNode(property[keys[i]]));
            tr.appendChild(atribut);
          }
          propertiesTable.appendChild(tr);
          document.querySelector(".fetch-button").style.display = "none";
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  submitHandler = (e) => {
    e.preventDefault();

    console.log(this.state);
    axios
      .post("http://localhost:5000/api/v1/properties", this.state)
      .then(this.successfullyAdded());
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
              </label>
            </div>
            <button className="post-button" type="submit">
              Adauga
            </button>
            <p id="added"></p>
          </form>
          <div class="crawler-operations">
            <div className="crawler">
              <button
                className="get-button-crawler"
                onClick={this.displayCrawlerStats}
              >
                Afiseaza statistici despre crawler
              </button>
              <p id="crawler-stats"></p>
            </div>
            <div className="crawler">
              <button onClick={this.startCrawlerRequest}>
                Baga o cheie la crawler
              </button>
              <p id="crawler-start"></p>
            </div>
            <div className="crawler">
              <button onClick={this.renewTrainingDataRequest}>
                Innoieste datele de antrenament
              </button>
              <p id="renew-training-data"></p>
            </div>
            <div id="get-properties">
              <button onClick={this.fetchProperties} className="fetch-button">
                Vizualizeaza toate proprietatile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminContent;
