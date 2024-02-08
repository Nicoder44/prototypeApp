import styles from "./styles.module.css";
import Header from "../../components/Header/Header";
import { useAuthContext } from "../../hooks/useAuthContext";
import React, { useState, useEffect } from 'react';
import axios from "axios";

const ProfileSettings = () => {
  const { user } = useAuthContext();
  const [profileImage, setProfileImage] = useState();
  const [description, setDescription] = useState('');

  useEffect(() => {
    
  }, [ user ]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formdata = new FormData()
      formdata.append('profileImage', profileImage)
      formdata.append('user', JSON.stringify(user))
      const response = await axios.post(
        'http://localhost:5000/api/matchs/updateProfile',
        formdata,
        {
          headers: { 'Authorization': `Bearer ${user.token}` },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la requête vers userMatched', error);
    }
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
                    <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files[0])} />
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
