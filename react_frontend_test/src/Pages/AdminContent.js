import React, { Component } from "react";
import "../Style/AdminContent.css";
import axios from "axios";

class AdminContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: {},
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
        console.log(response.data)
        const data = JSON.parse(JSON.stringify(response.data.titrez));
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

  retrainModel = () => {
    const text = document.getElementById("retrain-model-stats");
    const admin = "admin";
    axios
      .post(
        "http://localhost:5000/api/v1/admin/retrain-model",
        '"' + admin + '"',
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        let { data } = response;
        console.log(data.includes("*"));
        data = data.replaceAll("*", "").replaceAll("-", "");
        text.textContent = `Statistici despre reantrenarea modelului: ${data}`;
      })
      .catch((err) => {
        text.textContent = err;
      });
  };

  deleteProperty = (propertyId) => {
    console.log(`proprietatea cu id-ul: ${propertyId} va fi stearsa din bd`);
    const url = "http://localhost:5000/api/v1/properties/" + propertyId;
    axios
      .delete(url)
      .then((response) => {
        console.log("sters" + propertyId);
        const deleteRow = document.getElementById(propertyId);
        deleteRow.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateProperty = (propertyId) => {
    if (this.state.id[propertyId] === true) {
      console.log("IESI IN PIZDA MATI");
      return;
    }
    console.log("intru in updateProperty nu in a doua functie");
    console.log(`proprietatea cu id-ul: ${propertyId}`);
    const propertyAttributes = document.getElementById(propertyId).children;
    let attributesName = document.getElementById("table-head").firstChild
      .children;

    const propertyToUpdate = {};
    // const rowValues=[];
    for (let i = 0; i < attributesName.length; i++) {
      propertyToUpdate[attributesName[i].textContent] =
        propertyAttributes[i].textContent;
      // console.log("############", propertyAttributes[i].innerHTML);
      // e numar adica
      // console.log(`1:${propertyAttributes[i].textContent}`);
      // rowValues.push(propertyAttributes[i].textContent);
      if (attributesName[i].textContent === "zone") {
        const zona = `"${propertyAttributes[i].textContent}"`;
        const inner = `<input type='text' value=${zona} name=${zona}>`;
        propertyAttributes[i].innerHTML = "";
        propertyAttributes[i].innerHTML = inner;
        continue;
      }
      if (!isNaN(propertyAttributes[i].textContent)) {
        // console.log("INTRU VREODATA AICI???");
        // nu cred ca am nevoie de onchange pentru ca aici creez obiectul si il dau asa prin post
        const inner = `<input type='number' value=${propertyAttributes[i].textContent} name=${propertyAttributes[i].textContent}>`;
        propertyAttributes[i].innerHTML = "";
        propertyAttributes[i].innerHTML = inner;
      } else {
        const inner = `<input type='text' value=${propertyAttributes[i].textContent} name=${propertyAttributes[i].textContent}>`;
        propertyAttributes[i].innerHTML = "";
        propertyAttributes[i].innerHTML = inner;
      }
    }
    // console.log(`atributele sunt:${attributes}`);
    // console.log(propertyToUpdate);

    const editBtn = document.getElementById("editBtn-" + propertyId);

    // id=id.split("-")[1]
    // editBtn.removeEventListener("click",this.updateProperty);
    // this.state.id[propertyId]="true";
    this.setState((prevState) => {
      let id = Object.assign({}, prevState.id);
      id[propertyId] = true;
      return { id };
    });
    console.log("::::::::::::::::::::::", this.state.id);
    editBtn.addEventListener("click", () => {
      this.putRequest("editBtn-" + propertyId);
    });
    // console.log(`row-values:${rowValues}`)
    editBtn.textContent = "updateeeeee";
  };

  putRequest = (btnID) => {
    console.log("INTRU IN PULAM EA AIAIC");
    let propertyID = btnID.split("-")[1];
    const updatedRow = document.getElementById(propertyID).children;
    console.log(propertyID);
    const propertyToUpdate = {};
    console.log("row:", updatedRow);
    console.log("444------", updatedRow[0].firstChild.value);
    // const propertyAttributes = document.getElementById(propertyId).children;
    let attributesName = document.getElementById("table-head").firstChild
      .children;
    propertyToUpdate["id"]=propertyID;
    for (let i = 0; i < attributesName.length; i++) {
      propertyToUpdate[attributesName[i].textContent] =
        updatedRow[i].firstChild.value;
    }
    console.log(propertyToUpdate);
    const url = "http://localhost:5000/api/v1/properties/"+propertyID;
    axios
      .put(url, propertyToUpdate)
      .then((response) => {
        console.log("O MEEERS");
      })
      .catch((err) => {
        console.log(err);
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
        tableHead.setAttribute("id", "table-head");
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
          tr.setAttribute("id", property[keys[0]]);

          for (let i = 1; i < keys.length; i++) {
            const atribut = document.createElement("td");
            // console.log("----------------", property[keys[i]]);
            atribut.appendChild(document.createTextNode(property[keys[i]]));
            tr.appendChild(atribut);
          }
          const deleteBtn = document.createElement("button");
          // deleteBtn.setAttribute("id","btn"+property[keys[0]])
          deleteBtn.addEventListener("click", () =>
            this.deleteProperty(property[keys[0]])
          );
          const editBtn = document.createElement("button");
          editBtn.setAttribute("id", "editBtn-" + property[keys[0]]);
          editBtn.addEventListener("click", () => {
            this.updateProperty(property[keys[0]]);
          });
          editBtn.appendChild(document.createTextNode("edite me"));
          // console.log(property[keys[0]]);
          deleteBtn.appendChild(document.createTextNode("delete me"));
          // TODO sa incerc sa fac edit btn
          tr.appendChild(deleteBtn);
          tr.appendChild(editBtn);
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
        <h1>Admin Dashboard</h1>
      
        
        <h2>Add a new property to the database:</h2>
        <div className="dataFormNEW">
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
              Add to database
            </button>
            
          </form>
          <p id="added" className="add_to_db_confirmation"></p>
          <div className="crawler-operations">

            <div className="top-buttons">

            <div className="crawler">
              <button
                className="get-button-crawler"
                onClick={this.displayCrawlerStats}
              >
                Show crawler statistics
              </button>
              <p id="crawler-stats"></p>
            </div>
            <div className="crawler">
              <button onClick={this.startCrawlerRequest}>
                Start the crawler
              </button>
              <p id="crawler-start"></p>
            </div>
            <div className="crawler">
              <button onClick={this.renewTrainingDataRequest}>
                Renew training data
              </button>
              <p id="renew-training-data"></p>
            </div>

            </div>

            <div className="bottom-buttons">

            <div className="crawler">
              <button onClick={this.retrainModel}>
                Retrain prediction model
              </button>
              <p id="retrain-model-stats"></p>
            </div>
            <div id="get-properties" className="crawler">
              <button onClick={this.fetchProperties} className="fetch-button">
                Show all properties stored
              </button>
            </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminContent;
