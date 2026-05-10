import "./StatReseau.css";

function StatReseau({ lignes }) {
  // Nombre total de lignes
  const totalLignes = lignes.length;

  // Total des arrêts
  const totalArrets = lignes.reduce((somme, ligne) => {
    return somme + ligne.arrets;
  }, 0);

  // Ligne avec le plus d’arrêts
  const ligneMax = lignes.reduce((max, ligne) => {
    return ligne.arrets > max.arrets ? ligne : max;
  }, lignes[0]);

  return (
    <div className="stat-reseau">
      <h3>Statistiques du réseau</h3>

      <p>🚌 Nombre de lignes : {totalLignes}</p>

      <p>📍 Total des arrêts : {totalArrets}</p>

      <p>
        ⭐ Ligne la plus longue : {ligneMax.numero} ({ligneMax.arrets} arrêts)
      </p>
    </div>
  );
}

export default StatReseau;
