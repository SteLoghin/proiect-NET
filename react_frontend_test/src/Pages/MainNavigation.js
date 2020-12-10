import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Style/mainNavigation.css';


const MainNavigation = props => {
    return (
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>DotNetHouse</h1>
            </div>
            
            <nav className="main-navigation__item">
                <ul>
                    <React.Fragment>
                        <li><NavLink to="/home">Home</NavLink></li>
                        <li><NavLink to="/price-prediction">PricePredictionForm</NavLink></li>
                        <li><NavLink to="/endpoint2">TestEndpoint2</NavLink></li>
                        <li><NavLink to="/endpoint3">TestEndpoint3</NavLink></li>
                    </React.Fragment>
                </ul>
            </nav>
        </header>
        );
};
   


export default MainNavigation;