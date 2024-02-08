import styles from "./styles.module.css";
import Header from "../../components/Header/Header";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMatchContext } from "../../hooks/useMatchContext";
import UserCard from "../../components/UserCard/UserCard"; 
import React, { useState, useEffect } from 'react';
import axios from "axios";

const Account = () => {
  const { user } = useAuthContext();
  const { metUser, dispatch } = useMatchContext();
  const [fetchNewUser, setFetchNewUser] = useState(false);
  const [fetchCreateMatch, setCreateMatch] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchMet = async () => {

      const data = {mail : user.mail}

      const response = await fetch('http://localhost:5000/api/matchs/pickRandomUser', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_MET_USER', payload: json });
      }
    };

    const createMatch = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/matchs/userMatched',
          { metUser, user },
          {
            headers: { 'Authorization': `Bearer ${user.token}` },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la requête vers userMatched', error);
      }
    };

    if (user && metUser && fetchCreateMatch)
    {
      createMatch();
      setCreateMatch(false);
    }

    if (user && fetchNewUser) {
      fetchMet();
      setFetchNewUser(false);
    }
  }, [dispatch, user, fetchNewUser]);

  const handleFetchNewUser = () => {
    setFetchNewUser(true);
  };

  const handleCreateMatch = () => {
    setCreateMatch(true);
  };

  const handleSetMsg = (message) => {
    setMsg(message);
  }

  return (
    <div>
      <Header />
      <div>
        {user ? (
          <div className={styles.mainDiv}>
            <div className={styles.butter}>Bienvenue {user.prenom} !</div>
            <div className={styles.pe}>{msg ? (msg):('Qui sait ce que le sort vous réserve aujourd\'hui ?')}</div>
              {metUser ? ( <UserCard user={metUser} handleSetMsg={handleSetMsg} createMatch={handleCreateMatch} handleFetchNewUser={handleFetchNewUser}/>):(
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
