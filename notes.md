# Structure 
- index.phtml
- ranking.phtml
- admin.phtml
- config.php
- autoloader.php 
- add-score.php
- get-score.php
- reset-score.php
- dal 
    - dao 
    - models 
       
- assets 
    - css
    - js
    - img
- sections
    - entete.phtml
    - head.phtml
    - pied.phtml
    - retroaction.phtml
# Time log 
- Day #1 - 22h30 - 00:40
- Day #2 - 21h30 - 
# chat : 
Bien sûr, voici une explication claire des endpoints que tu vas devoir créer pour ton backend, avec leur rôle précis et fonctionnement attendu :
1. add-score.php — Endpoint pour ajouter un nouveau score
Rôle

    Recevoir les données du score envoyées par le front (ex : pseudo, wpm, accuracy, raw, consistency, date) via une requête HTTP POST.

    Valider les données reçues.

    Créer un objet Score avec ces données.

    Appeler la méthode insert() de ScoreDao pour enregistrer ce score en base.

    Retourner une réponse JSON indiquant succès ou erreur.

Exemple de workflow

    Le front envoie un POST avec :

{
  "pseudo": "Alim",
  "wpm": 307.6,
  "accuracy": 98.3,
  "raw": 329.17,
  "consistency": 92.73,
  "createdAt": "2025-07-25 20:47:00"
}

Le backend crée l’objet Score, insère en BD.

Retour JSON :

    { "success": true, "message": "Score added successfully" }

2. get-scores.php — Endpoint pour récupérer le classement
Rôle

    Fournir la liste des meilleurs scores (ex: top 50) au front via une requête HTTP GET.

    Appeler getTopScores() dans ScoreDao.

    Renvoyer les scores sous forme JSON.

Exemple de workflow

    Le front fait un GET : /get-scores.php

    Le backend renvoie :

    [
      { "pseudo": "Alim", "wpm": 307.6, "accuracy": 98.3, ... },
      { "pseudo": "James", "wpm": 295.4, "accuracy": 97.1, ... },
      ...
    ]

3. (Optionnel) delete-scores.php — Endpoint admin pour reset
Rôle

    Permettre à un administrateur de vider le leaderboard (supprimer tous les scores).

    Appelé via une requête POST ou DELETE sécurisée (ex: avec un token).

    Appelle deleteAll() dans ScoreDao.

    Renvoyer un JSON de confirmation.

Pourquoi ces endpoints ?

    Ils séparent bien la logique : ajout / lecture / administration.

    Utilisables en AJAX pour une mise à jour en temps réel sans recharger la page.

    Permettent au front d’afficher un leaderboard toujours à jour et d’ajouter facilement des nouveaux résultats.

Comment connecter avec le front ?

    Pour afficher le leaderboard : appeler régulièrement (ex: toutes les 30s) get-scores.php pour rafraîchir la liste.

    Pour envoyer un nouveau score : envoyer un POST vers add-score.php après chaque session.

    Pour admin (facultatif) : interface avec bouton "Reset" qui appelle delete-scores.php.