import React, { useState } from 'react';

const Register = () => {
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prenom: prenom, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.msg); // Message de succès
      } else {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', data.msg);
      }
    } catch (error) {
      console.error('Erreur lors de la requête d\'ajout de l\'utilisateur :', error);
    }
  };

  return (
    <div>
      <h2>Ajouter un utilisateur</h2>
      <label>Prenom:</label>
      <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />

      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleAddUser}>Ajouter l'utilisateur</button>
    </div>
  );
};

export default Register;
