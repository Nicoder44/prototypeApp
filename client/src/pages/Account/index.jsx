import styles from "./styles.module.css"
import Header from "../../components/Header/Header"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useMatchContext } from "../../hooks/useMatchContext"

// Account.js
import React, { useContext, useEffect } from 'react';

const Account = () => {
  const {user} = useAuthContext()
  const {metUser, dispatch} = useMatchContext()

  useEffect(() => {
    const fetchMet = async() => {
      const response = await fetch('http://localhost:5000/api/matchs/pickRandomUser', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })

      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_MET_USER', payload: json})
      }
    }

    if(user) {
      fetchMet()
    }

  }, [dispatch, user])

  return (
    <div>
        <Header />
        <div>
        {user ? (
            <div className={styles.mainDiv}>
            <h2>Bienvenue {user.prenom} !</h2>
            <p>Qui sait ce que le sort vous réserve aujourd'hui ?</p>
            {metUser && <p>{metUser.prenom}</p>}
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
