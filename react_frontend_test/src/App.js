import logo from './logo.svg';
import './App.css';
import React from 'react';
import PostForm from './Components/PostForm';
import Endpoint2Page from './Components/Endpoint2Page';
import Endpoint3Page from './Components/Endpoint3Page';
import MainNavigation from './Components/MainNavigation';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
       <MainNavigation />

       <main className="main-content">
        <Switch>
          <Redirect from="/" to="home" exact/>

          <Route path="/price-prediction" component={PostForm} />
          <Route path="/endpoint2" component={Endpoint2Page}/>
          <Route path="/endpoint3" component={Endpoint3Page}/>

        </Switch>
        </main>

       
      </React.Fragment>

    </BrowserRouter>
  );
}

export default App;
