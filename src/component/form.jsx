import React, { useState } from "react";
import './form.css'; 

function Form(props) {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(true); // true = Inscription, false = Connexion

    // Gestion de la soumission du formulaire
    const gererSoumission = (evenement) => {
        evenement.preventDefault(); // Empêche le rechargement de la page
        
        // Si Connexion, on met un prénom par défaut, sinon on prend le prénom saisi
        const prenomUtilisateur = isSignup ? prenom : "Popina";

        // Déclenche la fonction reçue du composant parent (App.jsx)
        if (props.onConnexionReussie) {
            props.onConnexionReussie(prenomUtilisateur);
        }
    };

    return (
        <div className="carte-verre">
            <h2 className="titre-form">{isSignup ? "Inscription" : "Connexion"}</h2>
            
            <form onSubmit={gererSoumission}>
                {/* Champs Nom et Prénom affichés UNIQUEMENT en mode Inscription */}
                {isSignup && (
                    <div className="input-group">
                        <span className="icone">👤</span>
                        <input 
                            type="text" 
                            placeholder="Nom" 
                            value={nom} 
                            onChange={(e) => setNom(e.target.value)}
                        />
                    </div>
                )}

                {isSignup && (
                    <div className="input-group">
                        <span className="icone">👤</span>
                        <input 
                            type="text" 
                            placeholder="Prénom" 
                            value={prenom} 
                            onChange={(e) => setPrenom(e.target.value)}
                        />
                    </div>
                )}

                {/* Champ Email visible tout le temps */}
                <div className="input-group">
                    <span className="icone">📧</span>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Champ Mot de passe visible tout le temps */}
                <div className="input-group">
                    <span className="icone">🔒</span>
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                {/* Bouton dont le texte s'adapte automatiquement */}
                <button type="submit" className="btn-form">
                    {isSignup ? "Créer mon compte" : "Se connecter"}
                </button>
                
                {/* Lien de basculement d'un mode à l'autre */}
                <p className="texte-bascule">
                    {isSignup ? "Déjà un compte ? " : "Pas encore de compte ? "}
                    <span className="lien-cliquable" onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? "Se connecter" : "S'inscrire"}
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Form;
