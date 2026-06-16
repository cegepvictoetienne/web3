# Exercice - Hydratation

Identifier et corriger des erreurs d'hydratation :

- Créer un Client Component `app/horloge/page.tsx` qui affiche l'heure actuelle :
    - **Version incorrecte** : utiliser `new Date().toLocaleTimeString()` directement dans le rendu et observer l'erreur d'hydratation dans la console
    - **Version correcte** : utiliser `useState` et `useEffect` pour mettre à jour l'heure uniquement côté client
- Créer un Client Component `app/theme/page.tsx` qui lit le thème depuis `localStorage` :
    - **Version incorrecte** : accéder à `localStorage` directement dans le composant et observer l'erreur
    - **Version correcte** : accéder à `localStorage` uniquement dans un `useEffect`
- Créer un Client Component `app/banniere/page.tsx` qui affiche « Mobile » ou « Bureau » selon la largeur de la fenêtre :
    - Corriger l'erreur causée par `typeof window !== "undefined" && window.innerWidth < 768` utilisé directement dans le rendu
    - Utiliser `useState` initialisé à `false` et mettre à jour dans `useEffect`
