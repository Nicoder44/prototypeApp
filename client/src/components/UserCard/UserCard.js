// UserCard.js
import React from 'react';
import styles from './styles.module.css';

const UserCard = ({ user, onAccept, handleFetchNewUser }) => {
  return (
    <div className={styles.userCard}>
      <div className={styles.userHeader}>
        <h3>{user.prenom} {user.nom} - {user.nom} ans</h3>
      </div>
      <div className={styles.userPhoto}>
        <img src="https://via.placeholder.com/300" alt={`${user.prenom} ${user.nom}`} />
      </div>
      <div className={styles.userFooter}>
        <button className={`${styles.delete} ${styles.button}`} onClick={handleFetchNewUser}></button>
        <button className={`${styles.accept} ${styles.button}`} onClick={onAccept}>
          <i className="fa fa-check" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

export default UserCard;
