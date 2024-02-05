import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaBars } from 'react-icons/fa'; // Import des logos FontAwesome
import './Header.css';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout();
    window.location = "/";
  }

  const handleClick2 = () => {
    window.location = "/monprofil";
  }

  const handleClick3 = () => {
    window.location = "/account";
  }

  const handleToggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <FaHeart className="heart-icon" />
          <h1>Polylove</h1>
        </div>
        <nav className={`nav ${isMenuOpen ? 'show-menu' : ''}`}>
          {user && (
            <div>
              <span className='textMail'>{user.prenom} {user.nom}</span>
              <button onClick={handleClick3}>Rencontres</button>
              <button onClick={handleClick2}>Mon Profil</button>
              <button onClick={handleClick}>Déconnexion</button>
          </div>
          )}
          {!user && (
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/register">S'inscrire</Link>
            </li>
          </ul>
          )}
        </nav>
        <div className="menu-toggle" onClick={handleToggleMenu}>
          <FaBars />
        </div>
      </div>
    </header>
  );
};

export default Header;
