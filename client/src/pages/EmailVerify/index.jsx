import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from '../../components/Header/Header';

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
				const url = `http://localhost:5000/verify/${param.id}/${param.token}`;
                
				const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setValidUrl(true);
                } else {
                    console.log(`Error: ${response.status} - ${response.statusText}`);
                    setValidUrl(false);
                }
			} catch (error) {
				console.error("Error:", error);
				setValidUrl(false);
			}
        };
        verifyEmailUrl();
    }, [param]);

    return (
        <div>
        <Header />
        <div className={styles.container2}>
            {validUrl ? (
                <p className={styles.successMessage}>Email vérifié avec succès ! Profitez de nouvelles rencontres !</p>
            ) : (
                <p className={styles.errorMessage}>Erreur lors de la vérification de l'e-mail. Veuillez réessayer.</p>
            )}
            {/* Vous pouvez ajouter des liens ou rediriger ici en fonction du résultat */}
            {validUrl ? (
                <Link to="/" className={styles.returnLink}>Retour à la page d'accueil</Link>
            ) : (
                <Link to="/contact-support" className={styles.returnLink}>Contacter le support</Link>
            )}
        </div>
    </div>
    );
};

export default EmailVerify;