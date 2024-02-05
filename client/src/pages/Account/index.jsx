import styles from "./styles.module.css";
import Header from "../../components/Header/Header";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMatchContext } from "../../hooks/useMatchContext";
import UserCard from "../../components/UserCard/UserCard"; 
import React, { useState, useEffect } from 'react';

const Account = () => {
  const { user } = useAuthContext();
  const { metUser, dispatch } = useMatchContext();
  const [fetchNewUser, setFetchNewUser] = useState(false);

  useEffect(() => {
    const fetchMet = async () => {
      const response = await fetch('http://localhost:5000/api/matchs/pickRandomUser', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_MET_USER', payload: json });
      }
    };

    if (user && fetchNewUser) {
      fetchMet();
      setFetchNewUser(false);
    }
  }, [dispatch, user, fetchNewUser]);

  const handleFetchNewUser = () => {
    setFetchNewUser(true);
  };

  return (
    <div>
      <Header />
      <div>
        {user ? (
          <div className={styles.mainDiv}>
            <h2>Bienvenue {user.prenom} !</h2>
            <p>Qui sait ce que le sort vous réserve aujourd'hui ?</p>
              {metUser ? ( <UserCard user={metUser} handleFetchNewUser={handleFetchNewUser}/>):(
              <button onClick={handleFetchNewUser}>Commencer à faire des rencontres !</button>)}
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
