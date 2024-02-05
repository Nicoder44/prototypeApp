import React, { useRef } from 'react';
import styles from './styles.module.css';
import Swipeable from "react-swipy";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartCrack } from '@fortawesome/free-solid-svg-icons'

const UserCard = ({ user, createMatch, handleFetchNewUser }) => {
  const heart = <FontAwesomeIcon icon={faHeart} />
  const brokenHeart = <FontAwesomeIcon icon={faHeartCrack} />

  const swipeableRef = useRef(null);

  const afterSwipe = () => {
    const swipeableState = swipeableRef.current.state;
    const direction = swipeableState.offset > 0 ? 'right' : 'left';
    
    if(direction === "right")
    {
      console.log('oui');
      createMatch()
      handleFetchNewUser()
    }
    else
    {
      handleFetchNewUser()
    }
  };

  const getAge = function () {
    if (user.dateNaissance) {
        const today = new Date();
        const birthDate = new Date(user.dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    } else {
        return null; 
    }
};

  return (
    <Swipeable
      ref={swipeableRef}
      buttons={({ right, left }) => (
        <div className={styles.userFooter}>
          <button className={`${styles.delete} ${styles.button}`} onClick={left}>
            {brokenHeart}
          </button>
          <button className={`${styles.accept} ${styles.button}`} onClick={right}>
            {heart}
          </button>
        </div>
      )}
      onAfterSwipe={afterSwipe}
      min={50}
    >
      <div className={styles.userCard}>
        <div className={styles.userHeader}>
          <h3>{user.prenom} {user.nom.charAt(0)}.  {getAge()} ans</h3>
        </div>
        <div className={styles.userPhoto}>
          <img src="https://via.placeholder.com/300" alt={`${user.prenom} ${user.nom}`} draggable="false"/>
        </div>
      </div>
    </Swipeable>
  );
}

export default UserCard;
