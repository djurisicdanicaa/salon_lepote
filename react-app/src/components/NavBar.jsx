import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/navbar.css'; 

const NavBar = () => {
    return (
        <header className='navbar'>
           <Link to="/" className='navbar-logo'>
            <img src={require('../assets/logo.png')} alt="Logo" className='logo-img' />
            <span>Fontastični nokti</span>
            </Link>

            <nav className='navbar-links'>
                <Link to="/">Početna</Link>
                <Link to="/reservation">Rezervacija termina</Link>
                <Link to="/reservation/details">Pregled rezervacija</Link>

            </nav>
        </header>
    );


};

export default NavBar;