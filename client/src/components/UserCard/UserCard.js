import React, { useRef } from 'react';
import styles from './styles.module.css';
import Swipeable from "react-swipy";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartCrack } from '@fortawesome/free-solid-svg-icons'

const UserCard = ({ user, createMatch, handleFetchNewUser, handleSetMsg }) => {
  const heart = <FontAwesomeIcon icon={faHeart} />
  const brokenHeart = <FontAwesomeIcon icon={faHeartCrack} />

  const swipeableRef = useRef(null);
  const rightSwipeMessages = [
    "J'espère que ça va matcher !",
    "Il fait chaud ici !",
    "C'est le bon !",
    "Whaou !",
    "Croisons les doigts !",
    "Match parfait !",
    "Trop classe !",
    "Ca valait le coup de chercher !",
    "Bingo !",
    "Coup de foudre !",
    "C'est le destin !",
    "C'est écrit dans les étoiles !",
    "C'est le début de quelque chose !",
    "Enfin !",
    "Magique !",
    "C'est comme ça que ça doit être !",
    "Bien joué !",
    "La chance est avec toi !",
    "C'est le début d'une belle histoire !",
    "C'est prometteur !",
    "Tu as trouvé la perle rare !",
    "Il me plaît déjà !",
    "Je suis déjà accro !"
  ];
  const leftSwipeMessages = [
    "Je ne l'aurais pas choisi non plus !",
    "Beurk !",
    "Au secours !",
    "Trop vieux...",
    "Tu crois que tu valais mieux que lui ??",
    "Pas mon genre !",
    "Sérieusement ?",
    "Next !",
    "Il doit être sur Polylove depuis trop longtemps...",
    "Je passe mon tour !",
    "Tu mérites mieux !",
    "Pas assez original...",
    "La chemise, vraiment ?",
    "Ce sourire... faux !",
    "Il a l'air ennuyeux...",
    "Il ne sait pas poser pour une photo !",
    "Ce n'est pas mon prince charmant...",
    "Je suis difficile, mais pas à ce point !",
    "La coupe de cheveux... non merci !",
    "Il est où le filtre Snapchat ?",
    "C'est une blague ?",
    "Je préfère être célibataire !",
    "On dirait mon ex...",
    "Il est à la recherche de sa maman...",
    "Mauvaise vibe !",
    "Mauvaise posture...",
    "Zéro pointé !",
    "Next, please !",
    "On dirait une pub pour aspirateurs...",
  ];
  const getRandomMessage = (messages) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const afterSwipe = () => {
    const swipeableState = swipeableRef.current.state;
    const direction = swipeableState.offset > 0 ? 'right' : 'left';
    
    if(direction === "right")
    {
      console.log('oui');
      createMatch()
      handleFetchNewUser()
      const randomRightSwipeMsg = getRandomMessage(rightSwipeMessages);
      handleSetMsg(randomRightSwipeMsg);
    }
    else
    {
      handleFetchNewUser()
      const randomLeftSwipeMsg = getRandomMessage(leftSwipeMessages);
      handleSetMsg(randomLeftSwipeMsg);
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
          <div className={styles.butter}>{user.prenom} {user.nom.charAt(0)}.  {getAge()} ans</div>
          <div className={styles.description}>{user.description ? (user.description):(user.prenom + ' n\'a encore rien renseigné')}</div>
        </div>
        <div className={styles.userPhoto}>
          <img src={user.profileImage ? ("http://localhost:5000/images/"+user.profileImage):("http://localhost:5000/images/images.jpg")} alt={`${user.prenom} ${user.nom}`} draggable="false"/>
        </div>
      </div>
    </Swipeable>
  );
}

export default UserCard;
