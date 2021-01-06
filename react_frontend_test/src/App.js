import './App.css';
import React from 'react';
import PostForm from './Pages/PostForm';
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

          <Route path="/home" component={PostForm} />
          <Route path="/admin" component={AdminPage}/>
          <Route path="/admin-dashboard" component={AdminContent}/>
        </Switch>
        </main>

       
      </React.Fragment>

    </BrowserRouter>
  );
}

export default App;
