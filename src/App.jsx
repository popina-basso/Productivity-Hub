import React, { useState, useEffect } from 'react';
import './App.css'; 
import Form from './component/form'; 
import TodoList from './component/todo-list'; 

function App() {
  // Navigation : 'formulaire' par défaut, passera à 'todolist' après connexion
  const [ecranActuel, setEcranActuel] = useState('formulaire');
  
  // Prénom saisi dans le formulaire
  const [prenomValide, setPrenomValide] = useState('');
  
  // Thème de l'application : 'dark' ou 'light'
  const [theme, setTheme] = useState('dark');

  // Met à jour l'attribut HTML pour appliquer instantanément les variables CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fonction pour inverser le thème au clic sur le bouton
  const basculerTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Fonction appelée par le formulaire lors de la validation
  const connecterUtilisateur = (prenomRecu) => {
    setPrenomValide(prenomRecu);
    setEcranActuel('todolist'); // Allez hop, on change d'écran !
  };

  return (
    <div className="app-container">
      {/* Les trois orbes de lumière qui changent selon le thème */}
      <div className="cercle cercle-rose-top"></div>
      <div className="cercle cercle-cyan-middle"></div>
      <div className="cercle cercle-violet-blur"></div>

      {/* ÉCRAN 1 : Ton formulaire d'authentification */}
      {ecranActuel === 'formulaire' && (
        <Form onConnexionReussie={connecterUtilisateur} />
      )}

      {/* ÉCRAN 2 : le grand Dashboard de gestion de tâches */}
      {ecranActuel === 'todolist' && (
        <TodoList 
          prenomUtilisateur={prenomValide} 
          themeActuel={theme}
          onChangementTheme={basculerTheme}
        />
      )}
    </div>
  );
}

export default App;

