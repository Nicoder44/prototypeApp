import styles from "./styles.module.css";
import Header from "../../components/Header/Header";
import { useAuthContext } from "../../hooks/useAuthContext";
import React, { useState, useEffect } from 'react';

const ProfileSettings = () => {
  const { user } = useAuthContext();
  const [profileImage, setProfileImage] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    
  }, [ user ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <Header />
      <div>
        {user ? (
          <div className={styles.login_container}>
          <div className={styles.login_form_container}>
            <div className={styles.left}>
              <form className={styles.form_container} onSubmit={handleSubmit}>
                <h1>Changez vos informations</h1>
                <div>
                  <label>Nouvelle Photo de Profil:</label>
                  <div className="upload-btn-wrapper">
                    <button className="btn">Choisir un fichier</button>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
                <div>
                  <label>Nouvelle Description:</label>
                  <textarea className={styles.textarea} value={description} onChange={handleDescriptionChange} />
                </div>
                <button type="submit" className={styles.green_btn}>
                  Enregistrer
                </button>
              </form>
            </div>
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



export default ProfileSettings;
