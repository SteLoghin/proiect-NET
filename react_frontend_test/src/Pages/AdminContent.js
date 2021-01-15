import React, { Component } from "react";
import "../Style/AdminContent.css";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import {Row, Col, Button, Jumbotron, Form} from 'react-bootstrap';

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

  componentDidMount = () => {
    this.displayCrawlerStats();
  }

  successfullyAdded = () => {
    const addded = document.getElementById("info");
    addded.textContent =
      "Proprietatea a fost adaugata cu succes in baza de date!";
  };

  displayCrawlerStats = () => {
    const showStats = document.getElementById("info");
    showStats.textContent = "Asteptam raspunsul de la server...";
    axios
      .get("http://localhost:5000/api/v1/admin/crawling-stats")
      .then((response) => {
        showStats.textContent = "";
        const data = JSON.parse(JSON.stringify(response.data.titrez));
        const data1 = JSON.parse(JSON.stringify(response.data.imobiliare));
        const numberOfNewProperties = data.length;
        const totalCrawlTime = JSON.stringify(data.total_crawl_time).split(
          "."
        )[0];
        const crawlDate = data.last_crawl_datetime.split(" ");
        const lastCrawlHour = crawlDate[1].split(".")[0];
        showStats.innerHTML = `titirez.ro <br> Crawl-time ${totalCrawlTime} secunde <br> Data ${crawlDate[0]} ora ${lastCrawlHour} <br> Nr. prop. adaugate: ${numberOfNewProperties} <br>
        Imobiliare.ro <br> Crawl-time ${JSON.stringify(data1.total_crawl_time).split(".")[0]} secunde <br> Data ${data1.last_crawl_datetime.split(" ")[0]} ora <br> ${data1.last_crawl_datetime.split(" ")[1]} Nr. prop. adaugate: ${data1.length} <br>`;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  startCrawlerRequest = () => {
    const crawlerStart = document.getElementById("info");
    crawlerStart.textContent = "Asteptam raspunsul de la server...";
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
    const text = document.getElementById("info");
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
    const text = document.getElementById("info");
    text.textContent = "Loading...";
    const admin = "admin";
    axios
      .post(
        "http://localhost:5000/api/v1/admin/retrain-model",
        '"' + admin + '"',
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        let { data } = response;
        data = data.replaceAll("*", "").replaceAll("-", "");
        text.textContent = `Statistici despre reantrenarea modelului: ${data}`;
      })
      .catch((err) => {
        text.textContent = err;
      });
  };

  deleteProperty = (propertyId) => {
    const url = "http://localhost:5000/api/v1/properties/" + propertyId;
    axios
      .delete(url)
      .then((response) => {
        const deleteRow = document.getElementById(propertyId);
        deleteRow.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateProperty = (propertyId) => {
    if (this.state.id[propertyId] === true) {
      return;
    }
    const propertyAttributes = document.getElementById(propertyId).children;
    let attributesName = document.getElementById("table-head").firstChild
      .children;

    const propertyToUpdate = {};

    for (let i = 0; i < attributesName.length; i++) {
      propertyToUpdate[attributesName[i].textContent] =
        propertyAttributes[i].textContent;
      if (attributesName[i].textContent === "zone") {
        const zona = `"${propertyAttributes[i].textContent}"`;
        const inner = `<input type='text' value=${zona} name=${zona}>`;
        propertyAttributes[i].innerHTML = "";
        propertyAttributes[i].innerHTML = inner;
        continue;
      }
      if (!isNaN(propertyAttributes[i].textContent)) {
        const inner = `<input type='number' value=${propertyAttributes[i].textContent} name=${propertyAttributes[i].textContent}>`;
        propertyAttributes[i].innerHTML = "";
        propertyAttributes[i].innerHTML = inner;
      } else {
        const inner = `<input type='text' value=${propertyAttributes[i].textContent} name=${propertyAttributes[i].textContent}>`;
        propertyAttributes[i].innerHTML = "";
        propertyAttributes[i].innerHTML = inner;
      }
    }

    const editBtn = document.getElementById("editBtn-" + propertyId);

    this.setState((prevState) => {
      let id = Object.assign({}, prevState.id);
      id[propertyId] = true;
      return { id };
    });
    editBtn.addEventListener("click", () => {
      this.putRequest("editBtn-" + propertyId);
    });
    editBtn.textContent = "Update";
  };

  putRequest = (btnID) => {
    let propertyID = btnID.split("-")[1];
    const updatedRow = document.getElementById(propertyID).children;

    const propertyToUpdate = {};
    // const propertyAttributes = document.getElementById(propertyId).children;
    let attributesName = document.getElementById("table-head").firstChild
      .children;
    propertyToUpdate["id"]=propertyID;
    for (let i = 0; i < attributesName.length; i++) {
      propertyToUpdate[attributesName[i].textContent] =
        updatedRow[i].firstChild.value;
    }
    const url = "http://localhost:5000/api/v1/properties/"+propertyID;
    axios
      .put(url, propertyToUpdate)
      .then((response) => {
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

        const propertiesTable = document.getElementById("properties-table");
        //tableParent.appendChild(propertiesTable);
        const tableHead = document.createElement("thead");
        tableHead.setAttribute("id", "table-head");
        const firstRow = document.createElement("tr");
        let keys = Object.keys(propertiesList[0]);

        for (let i = 0; i < keys.length; i++) {
          const atribut = document.createElement("th");
          atribut.appendChild(document.createTextNode(keys[i]));
          firstRow.appendChild(atribut);
        }
        const actions = document.createElement("th");
        actions.appendChild(document.createTextNode("actions"));
        firstRow.appendChild(actions);

        tableHead.appendChild(firstRow);
        propertiesTable.appendChild(tableHead);
        // const tableBody=document.createElement("tbody");
        // dam la urma append la tableBody la tabel
        // cream elementele din tabel
        propertiesList.forEach((property) => {
          const tr = document.createElement("tr");
          tr.setAttribute("id", property[keys[0]]);

          for (let i = 0; i < keys.length; i++) {
            const atribut = document.createElement("td");
            atribut.appendChild(document.createTextNode(property[keys[i]]));
            tr.appendChild(atribut);
          }
          const deleteBtn = document.createElement("Button");
          deleteBtn.addEventListener("click", () =>
            this.deleteProperty(property[keys[0]])
          );
          const editBtn = document.createElement("Button");
          editBtn.setAttribute("id", "editBtn-" + property[keys[0]]);
          editBtn.addEventListener("click", () => {
            this.updateProperty(property[keys[0]]);
          });
          
          editBtn.appendChild(document.createTextNode("Edit"));
          deleteBtn.appendChild(document.createTextNode("Delete"));
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
      <Container>
        <h1>Admin Dashboard</h1>
      
        
        <h2>Add a new property to the database:</h2>
        <Form onSubmit={this.submitHandler}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Rooms</Form.Label>
              <Form.Control type="number" 
                name="Rooms"
                id="Rooms"
                value={rooms}
                onChange={this.changeHandler}
                required/>
            </Form.Group>

            <Form.Group as={Col} >
              <Form.Label>Area</Form.Label>
              <Form.Control type="number"
                  name="Area"
                  value={area}
                  onChange={this.changeHandler}
                  id="lotConfig"
                  required/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Floor</Form.Label>
              <Form.Control type="number" 
                  name="Floor"
                  id="floor"
                  value={floor}
                  onChange={this.changeHandler}
                  required/>
            </Form.Group>

            <Form.Group as={Col} >
              <Form.Label>Bathrooms</Form.Label>
              <Form.Control type="number"
                name="Bathrooms"
                value={bathrooms}
                onChange={this.changeHandler}
                id="Bathrooms"
                required/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Year</Form.Label>
              <Form.Control type="number" 
                  name="Year"
                  id="Year"
                  value={year}
                  onChange={this.changeHandler}
                  required/>
            </Form.Group>

            <Form.Group as={Col} >
              <Form.Label>Kitchens</Form.Label>
              <Form.Control type="number"
                name="Kitchens"
                id="kitchens"
                value={kitchens}
                onChange={this.changeHandler}
                required/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Link</Form.Label>
              <Form.Control type="text"
                id="Link"
                name="Link"
                value={link}
                onChange={this.changeHandler}
                required/>
            </Form.Group>

            <Form.Group as={Col} >
              <Form.Label>Zone</Form.Label>
              <Form.Control type="text"
                name="Zone"
                id="Zone"
                value={zone}
                onChange={this.changeHandler}
                required/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Price</Form.Label>
              <Form.Control  type="number"
                name="Price"
                id="Price"
                value={price}
                onChange={this.changeHandler}
                required/>
            </Form.Group>

            <Button variant="primary" className="post-button" type="submit">
              Submit
            </Button>
          </Form.Row>
        </Form>
        <Container>
            <Row>
              <Col>
              <Container>
                <Row><Col className="btn-col"><Button variant="success" onClick={this.retrainModel} className="full-width">Retrain Model</Button></Col></Row>
                <Row><Col className="btn-col"><Button variant="success" onClick={this.renewTrainingDataRequest} className="full-width">Renew training data</Button></Col></Row>
                <Row><Col className="btn-col"><Button variant="success" onClick={this.startCrawlerRequest} className="full-width">Start Crawler</Button></Col></Row>
                <Row><Col className="btn-col"><Button variant="success" onClick={this.displayCrawlerStats} className="full-width get-button-crawler">Show Crawler Statistics</Button></Col></Row>
                <Row><Col className="btn-col"><Button variant="success" onClick={this.fetchProperties} className="full-width fetch-button">Show properties</Button></Col></Row>
              </Container>
              </Col>
              <Col>
                <Jumbotron fluid>
                  <Container>
                    <p id="info">
                    </p>
                  </Container>
                </Jumbotron>
              </Col>
            </Row>
          </Container>
        <Table responsive="sm" striped bordered hover id="properties-table">
        </Table>
      </Container>
    );
  }
}

export default AdminContent;
