import './App.css';
import React from 'react';
import PostForm from './Pages/PostForm';
import Endpoint2Page from './Pages/Endpoint2Page';
import Endpoint3Page from './Pages/Endpoint3Page';
import AdminPage from './Pages/Admin';
import AdminContent from './Pages/AdminContent'
import MainNavigation from './Pages/MainNavigation';
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
          <Route path="/admin" component={AdminPage}/>
          <Route path="/admin-dashboard" component={AdminContent}/>
        </Switch>
        </main>

       
      </React.Fragment>

    </BrowserRouter>
  );
}

export default App;
