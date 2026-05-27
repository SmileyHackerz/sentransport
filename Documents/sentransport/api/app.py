import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les données JSON
with open("lignes_ddd.json", "r", encoding="utf-8") as f:
    lignes = json.load(f)

# Route d'accueil
@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l’API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

# Retourner toutes les lignes
@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

# Retourner une ligne par ID
@app.route("/lignes/<int:id>")
def get_ligne(id):
    ligne = next((l for l in lignes if l["id"] == id), None)

    if ligne:
        return jsonify(ligne)

    return jsonify({"erreur": "Ligne introuvable"}), 404

#Exercice1
@app.route("/arrets")
def get_arrets():
    arrets = set()

    for ligne in lignes:
        for arret in ligne["listeArrets"]:
            arrets.add(arret)

    return jsonify(sorted(list(arrets)))

#Exercice2
@app.route("/stats")
def get_stats():
    total_lignes = len(lignes)

    total_arrets = sum(ligne["arrets"] for ligne in lignes)

    ligne_plus_arrets = max(lignes, key=lambda l: l["arrets"])

    return jsonify({
        "total_lignes": total_lignes,
        "total_arrets": total_arrets,
        "ligne_plus_arrets": {
            "numero": ligne_plus_arrets["numero"],
            "arrets": ligne_plus_arrets["arrets"]
        }
    })

#Exercice3
@app.route("/lignes/recherche")
def rechercher_lignes():
    q = request.args.get("q", "").lower()

    resultats = []

    for ligne in lignes:
        texte = (
            ligne["depart"] + " " +
            ligne["arrivee"] + " " +
            " ".join(ligne["listeArrets"])
        ).lower()

        if q in texte:
            resultats.append(ligne)

    return jsonify(resultats)
    
# Lancer le serveur
if __name__ == "__main__":
    app.run(debug=True)