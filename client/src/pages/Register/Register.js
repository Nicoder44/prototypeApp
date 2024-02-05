import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import './Register.css'

const Register = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
	const [msg, setMsg] = useState("");
  const [dateNaissance, setDateNaissance] = useState('');

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prenom: prenom, nom: nom, email: email, password: password, dateNaissance: dateNaissance }),
      });
      setMsg(response.message);

      const data = await response.json();

      if (response.ok) {
        setMsg(data.message);
      } else {
        setError(data.message);
        setMsg(''); // Assure-toi de vider le message de succès en cas d'erreur
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', data.msg);
      }
    } catch (error) {
      console.error('Erreur lors de la requête d\'ajout de l\'utilisateur :', error);
    }
  };

  return (
    <div className="register-page">
      <Header />
      <div className='container'>
        <h2>Bienvenue sur PolyLove</h2>
        <label>Prénom:</label>
        <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />

        <label>Nom:</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />

        <label>Mot de passe:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Mail:</label>
        <input type="mail" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Date de naissance:</label>
        <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} />
        {error && <div>{error}</div>}
				{msg && <div>{msg}</div>}
        <button onClick={handleAddUser}>S'inscrire !</button>
      </div>
    </div>
  );
};

export default Register;
