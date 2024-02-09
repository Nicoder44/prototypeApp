import React, { useEffect } from 'react';
import styles from './styles.module.css'; 
import Header from "../../components/Header/Header";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMatchContext } from "../../hooks/useMatchContext";
import socketIOClient from 'socket.io-client';

const Chat = () => {
  const { user } = useAuthContext();
  const { matches } = useMatchContext();

  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000', {
      
      transports: ['websocket'],
      
    });
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.chatContainer}>
        {user ? (
          <div className={styles.chatWrapper}>
            <div className={styles.chatSidebar}>
              <h3>Rencontres</h3>
              <ul className={styles.userList}>
                {matches.map((match, index) => (
                  <li key={index} className={styles.userListItem}>
                    <img src={match.profileImage ? `http://localhost:5000/images/${match.profileImage}` : 'http://placehold.it/50x50'} alt={`${match.prenom} ${match.nom}`} />
                    <span>{`${match.prenom} ${match.nom.charAt(0)}.`}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.chatArea}>
              <p></p>
            </div>
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

export default Chat;
