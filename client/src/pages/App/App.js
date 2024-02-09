import React, { useContext, useState } from 'react';
import axios from "axios";
import styles from "./styles.module.css";
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const App = () => {

  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState(" ");

  const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

  const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", JSON.stringify(res.data));
      dispatch({ type: 'LOGIN', payload: res.data });
			window.location = "/account";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
      else{
        setError(error.response.data.message);
      }
		}
	};
  
  return (
    <div>
      <Header />
      <div className={styles.login_container}>
        <div className={styles.login_form_container}>
          <div className={styles.left}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Connecte toi !</h1>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="input" className={styles.green_btn}>
                Se Connecter
              </button>
            </form>
          </div>
          <div className={styles.right}>
            <h1>Première fois ici ?</h1>
            <Link to="/register">
              <button type="button" className={styles.white_btn}>
                S'inscrire
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
