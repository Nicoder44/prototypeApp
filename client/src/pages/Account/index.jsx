import styles from "./styles.module.css";
import Header from "../../components/Header/Header";
// Account.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Account = () => {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    // Effectuez votre logique de déconnexion ici, si nécessaire
    // ...

    // Dispatchez l'action pour mettre à jour le contexte avec un token null
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div>
        <Header />
        <div>
        {user ? (
            <div className={styles.mainDiv}>
            <h2>Bienvenue {user.prenom} !</h2>
            <p>Qui sait ce que le sort vous réserve aujourd'hui ?</p>
            <button onClick={handleLogout}>Se déconnecter</button>
            </div>
        ) : (
            <div className={styles.divNotConnected}>
            <h2>Veuillez vous connecter</h2>
            </div>
        )}
        </div>
    </div>
  );
};

export default Account;
