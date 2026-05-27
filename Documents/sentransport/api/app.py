import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les données JSON
with open("lignes_ddd.json", "r", encoding="utf-8") as f:
    lignes = json.load(f)

with open("arrets.json", "r") as f:
    arrets = json.load(f)

@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)

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

# Lancer le serveur
if __name__ == "__main__":
    app.run(debug=True)