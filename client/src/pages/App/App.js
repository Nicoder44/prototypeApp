import React, { useState } from 'react';
import logo from '../../assets/logo.svg';
import './App.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import Header from '../../components/Header/Header';

const App = () => {
  const [msg, setMsg] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = data => {
    setMsg(data.msg);
    setLoggedIn(true);
  };

  const handleClick = async () => {
    const data = await window.fetch('/api/Loveers');
    const json = await data.json();
    const msg = json.msg;

    setMsg(msg);
    console.log(json);
  };

  return (
    <div className="App-header">
        <Header />
        <img src={logo} className="App-logo" alt="logo" />
        {isLoggedIn ? (
          <div>
            <p>Welcome! You are logged in.</p>
            <p>{msg}</p>
          </div>
        ) : (
          <div>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <button onClick={handleClick}>Dis bonjour mec</button>
            <LoginForm onLogin={handleLogin} />
          </div>
        )}
      
    </div>
  );
};

export default App;
