import { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Recherche from "./Recherche";
import LigneBus from "./LigneBus";
import DetailLigne from "./DetailLigne";
import Footer from "./Footer";
import Carte from "./Carte";
function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  // 1. Crée la fonction de chargement (avant le useEffect)
  const chargerLignes = () => {
    setChargement(true); // On remet l'état de chargement à true
    setErreur(null); // On réinitialise l'erreur

    fetch("http://localhost:5000/lignes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setLignes(data);
        setChargement(false);
      })
      .catch((error) => {
        setErreur(error.message);
        setChargement(false);
      });
  };

  // 2. Le useEffect ne fait plus qu'appeler cette fonction au démarrage
  useEffect(() => {
    chargerLignes();
  }, []);
  const lignesFiltrees = lignes.filter(
    (l) =>
      l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
      l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
      l.numero.includes(recherche),
  );
  function handleClickLigne(ligne) {
    // Si on clique sur la ligne déjà sélectionnée, on la referme
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      // EXERCICE 3 : On interroge l'API Flask pour récupérer les détails
      fetch(`http://localhost:5000/lignes/${ligne.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des détails");
          }
          return response.json();
        })
        .then((data) => {
          // 'data' est le JSON de la ligne renvoyé par ton backend Flask !
          setLigneSelectionnee(data);
        })
        .catch((error) => {
          console.error("Erreur Exercice 3 :", error);
          // Optionnel : En cas de coupure réseau, on utilise la ligne locale en secours
          setLigneSelectionnee(ligne);
        });
    }
  }
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }
  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Verifiez que le serveur Flask est lance (python api/app.py).</p>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />
        {/* Nouveau bouton de rechargement */}
        <button onClick={chargerLignes} style={{ marginBottom: "20px" }}>
          Recharger les données
        </button>
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne
          {lignesFiltrees.length > 1 ? "s" : ""} trouvee
          {lignesFiltrees.length > 1 ? "s" : ""}
        </p>
        {lignesFiltrees.map((ligne) => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={
              ligneSelectionnee && ligneSelectionnee.id === ligne.id
            }
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
        <Carte />
      </main>
      <Footer />
    </div>
  );
}
export default App;
