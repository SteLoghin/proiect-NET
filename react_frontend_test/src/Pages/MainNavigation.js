import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Style/mainNavigation.css';
import {Navbar, Nav} from 'react-bootstrap';


const MainNavigation = props => {
    return (
        <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">DOT NET HOUSE</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/home">Home</Nav.Link>
            </Nav>
        </Navbar>
        </>
        );
};
   


export default MainNavigation;