# Exercice - Server et Client Components

Créer une page de catalogue de livres combinant Server et Client Components :

- Créer un Server Component `app/livres/page.tsx` qui :
    - Contient un tableau statique de livres (titre, auteur, genre, prix)
    - Passe les données au Client Component ci-dessous
- Créer un Client Component `app/livres/liste-livres.tsx` qui :
    - Reçoit les livres en props
    - Affiche un champ de recherche pour filtrer les livres par titre ou auteur
    - Affiche un menu déroulant pour filtrer par genre
    - Met à jour la liste en temps réel selon les filtres
- Créer un Client Component `app/livres/bouton-panier.tsx` qui :
    - Affiche un bouton « Ajouter au panier » pour chaque livre
    - Maintient un compteur du nombre d'articles dans le panier (affiché dans le bouton)
- S'assurer que la directive `"use client"` est présente uniquement dans les fichiers qui en ont besoin
