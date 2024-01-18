import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <header>
      <h1>Mon Header</h1>
      <nav>
        <ul>
          <Link to="/" relative='path'>Accueil</Link>
          <Link to="/register" relative='path'>S'inscrire</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
