import React, { useState, useEffect } from 'react';
import './todo-list.css';
import { supabase } from '../SupabaseClient';

function HorlogeEnDirect() {
  useEffect(() => {
    let idAnim;
    const maj = () => {
      const m = new Date();
      const bH = document.getElementById('heure-dynamique');
      const bD = document.getElementById('date-dynamique');
      if (bD) bD.innerText = "📅 " + m.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (bH) bH.innerText = "⏰ " + m.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      idAnim = requestAnimationFrame(maj);
    };
    idAnim = requestAnimationFrame(maj);
    return () => cancelAnimationFrame(idAnim);
  }, []);
  return (
    <div className="horloge-bloc">
      <span id="date-dynamique">Chargement...</span>
      <span className="separateur">|</span>
      <span id="heure-dynamique" className="heure-texte">00:00:00</span>
    </div>
  );
}

function TodoList(props) {
  const [nouvelleTache, setNouvelleTache] = useState('');
  const [recherche, setRecherche] = useState('');
  const [rechercheValidee, setRechercheValidee] = useState('');
  const [taches, setTaches] = useState([]);
  const [idEdition, setIdEdition] = useState(null);
  const [texteEdition, setTexteEdition] = useState('');
  const [tacheSel, setTacheSelectionnee] = useState(null);
  const [nouveauComm, setNouveauCommentaire] = useState('');

  const chargerTaches = async () => {
    const { data, error } = await supabase.from('taches').select('*').order('id', { ascending: true });
    if (!error && data) setTaches(data);
  };

  useEffect(() => { chargerTaches(); }, []);

   const ajouterTache = async (e) => {
    e.preventDefault();
    if (!nouvelleTache.trim() || taches.length >= 10) return;

    const { data, error } = await supabase
      .from('taches')
      .insert([{ texte: nouvelleTache, statut: 'a-faire', terminee: false, commentaires: [] }])
      .select();

    if (error) {
      alert("Problème de connexion au cloud : " + error.message);
    } else if (data && data.length > 0) {
      // CORRECTIF : On extrait la première case du tableau renvoyé par Supabase [data[0]]
      setTaches([...taches, data[0]]); 
      setNouvelleTache('');
    }
  };


  const supprimerTache = async (id) => {
    const { error } = await supabase.from('taches').delete().eq('id', id);
    if (!error) setTaches(taches.filter(t => t.id !== id));
  };

  const basculerStatut = async (id, etat) => {
    const nEtat = !etat;
    const nStatut = nEtat ? "termine" : "a-faire";
    const { error } = await supabase.from('taches').update({ terminee: nEtat, statut: nStatut }).eq('id', id);
    if (!error) setTaches(taches.map(t => t.id === id ? { ...t, terminee: nEtat, statut: nStatut } : t));
  };

  const sauvegarderEdition = async (id) => {
    const { error } = await supabase.from('taches').update({ texte: texteEdition }).eq('id', id);
    if (!error) { setTaches(taches.map(t => t.id === id ? { ...t, texte: texteEdition } : t)); setIdEdition(null); }
  };

  const ajouterCommentaire = async () => {
    if (!nouveauComm.trim()) return;
    const lComm = tacheSel.commentaires || [];
    const majComm = [...lComm, nouveauComm];
    const { error } = await supabase.from('taches').update({ commentaires: majComm }).eq('id', tacheSel.id);
    if (!error) {
      setTaches(taches.map(t => t.id === tacheSel.id ? { ...t, commentaires: majComm } : t));
      setTacheSelectionnee({ ...tacheSel, commentaires: majComm });
      setNouveauCommentaire('');
    }
  };

  const tachesFiltrees = taches.filter(t => t.texte && t.texte.toLowerCase().includes(rechercheValidee.toLowerCase()));

  return (
    <div className="dashboard-container-verre">
      <header className="todo-header">
        <div className="titre-section">
          <h1>Hub de productivité</h1>
          <p className="msg-bienvenue">Bonjour {props.prenomUtilisateur || "Popina"}, gère tes objectifs avec rigueur !</p>
        </div>
        <form className="barre-recherche" onSubmit={(e) => { e.preventDefault(); setRechercheValidee(recherche); }}>
          <input type="text" placeholder="Rechercher une tâche + Entrée..." value={recherche} onChange={(e) => { setRecherche(e.target.value); if(e.target.value === '') setRechercheValidee(''); }} />
          <button type="submit" className="btn-loupe">🔍</button>
        </form>
      </header>

      <div className="todo-main-1">
        <button className="btn-theme-toggle" onClick={props.onChangementTheme}>
          {props.themeActuel === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
        </button>
        <HorlogeEnDirect />
      </div>

      <form className="zone-saisie-tache" onSubmit={ajouterTache}>
        <input type="text" placeholder="Ajouter une nouvelle tâche..." value={nouvelleTache} onChange={(e) => setNouvelleTache(e.target.value)} />
        <button type="submit" className="btn-ajouter-tache">+</button>
      </form>

      <div className="todo-coeur-layout">
        <div className="colonne-liste-taches">
          <h3>Mes Tâches ({taches.length}/10)</h3>
          <ul className="liste-principale">
            {taches.length === 0 ? <p className="erreur-recherche">Votre liste est vide. Ajoutez une tâche ! 📝</p> : 
            tachesFiltrees.map((tache) => (
              <li key={tache.id} className={`tache-item ${tache.terminee ? 'barree' : ''}`}>
                <div className="tache-gauche">
                  <input type="checkbox" checked={tache.terminee} onChange={() => basculerStatut(tache.id, tache.terminee)} />
                  {idEdition === tache.id ? (
                    <input type="text" className="input-edition-ligne" value={texteEdition} onChange={(e) => setTexteEdition(e.target.value)} onBlur={() => sauvegarderEdition(tache.id)} onKeyDown={(e) => e.key === 'Enter' && sauvegarderEdition(tache.id)} autoFocus />
                  ) : <span>{tache.texte}</span>}
                </div>
                <div className="tache-actions">
                  <button className="btn-action-tache btn-comm" onClick={() => setTacheSelectionnee(tache)}>💬</button>
                  <button className="btn-action-tache btn-edit" onClick={() => { setIdEdition(tache.id); setTexteEdition(tache.texte); }}>✏️</button>
                  <button className="btn-action-tache btn-suppr" onClick={() => supprimerTache(tache.id)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="colonne-kanban-board">
          <h3>Tableau Kanban</h3>
          <div className="kanban-colonnes-container">
            <div className="kanban-colonne">
              <h4>À faire 📌</h4>
              <div className="kanban-zone-taches">{taches.filter(t => t.statut === "a-faire").map(t => <div key={t.id} className="kanban-badge-tache">{t.texte}</div>)}</div>
            </div>
            <div className="kanban-colonne">
              <h4>En cours ⚡</h4>
              <div className="kanban-zone-taches">{taches.filter(t => t.statut === "en-cours").map(t => <div key={t.id} className="kanban-badge-tache">{t.texte}</div>)}</div>
            </div>
            <div className="kanban-colonne">
              <h4>Terminé ✅</h4>
              <div className="kanban-zone-taches">{taches.filter(t => t.statut === "termine").map(t => <div key={t.id} className="kanban-badge-tache tache-kanban-barree">{t.texte}</div>)}</div>
            </div>
          </div>
        </div>
      </div>

      {tacheSel && (
        <div className="modal-overlay-sombre">
          <div className="popup-verre-commentaires">
            <h3>Notes sur : <span>{tacheSel.texte}</span></h3>
            <div className="zone-affichage-commentaires">
              {!tacheSel.commentaires || tacheSel.commentaires.length === 0 ? <p className="aucun-comm">Aucune note... 🖊️</p> : tacheSel.commentaires.map((c, i) => <p key={i} className="commentaire-bulle">🔹 {c}</p>)}
            </div>
            <div className="form-ajouter-commentaire">
              <input type="text" placeholder="Écrire une note..." value={nouveauComm} onChange={(e) => setNouveauCommentaire(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ajouterCommentaire()} />
              <button onClick={ajouterCommentaire}>Ajouter</button>
            </div>
            <button className="btn-fermer-popup" onClick={() => setTacheSelectionnee(null)}>Fermer</button>
          </div>
        </div>
      )}

      <footer className="todo-footer">
        <p>© 2026 - <span className="nom-copyright">popina basso developpeuse-web junior</span> | Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default TodoList;
