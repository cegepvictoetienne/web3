# Exercice - API Routes

Créer une API REST pour gérer une liste de tâches (to-do list) :

- Créer `app/api/taches/route.ts` avec :
    - `GET` : retourner toutes les tâches (tableau en mémoire)
    - `POST` : ajouter une nouvelle tâche (champs : `titre`, `complete`)
    - Valider que le champ `titre` est présent, sinon retourner un `400`
- Créer `app/api/taches/[id]/route.ts` avec :
    - `GET` : retourner une tâche par son identifiant, `404` si introuvable
    - `PUT` : modifier une tâche existante (titre ou état `complete`)
    - `DELETE` : supprimer une tâche, `404` si introuvable
- Tester toutes les routes avec Thunder Client ou `curl` :
    - Créer au moins 3 tâches via `POST`
    - Récupérer la liste via `GET`
    - Marquer une tâche comme complète via `PUT`
    - Supprimer une tâche via `DELETE`
    - Tester le cas d'un `id` inexistant pour vérifier le `404`
