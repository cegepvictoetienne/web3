# Exercice - Modes de rendu Next.js

Créer une application qui démontre les différents modes de rendu :

- Créer une page `app/statique/page.tsx` en rendu statique (SSG) :
    - Affiche une page « FAQ » avec des questions/réponses codées en dur
    - Vérifier après `npm run build` que la route est marquée `○` (Static)
- Créer une page `app/actualites/page.tsx` en ISR :
    - Utiliser `export const revalidate = 30`
    - Récupérer des données depuis `https://jsonplaceholder.typicode.com/posts?_limit=5`
    - Afficher la liste des articles avec leur titre et contenu
    - Afficher la date et l'heure de génération de la page
- Créer une page `app/heure/page.tsx` en SSR :
    - Utiliser `export const dynamic = "force-dynamic"`
    - Afficher l'heure actuelle du serveur
    - Vérifier que l'heure se met à jour à chaque rafraîchissement
- Créer une page `app/couleur/page.tsx` en CSR :
    - Afficher un bouton qui change la couleur de fond de la page aléatoirement au clic
    - Utiliser `useState` et `"use client"`
