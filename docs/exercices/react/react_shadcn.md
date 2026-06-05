# Exercice - shadcn/ui

Créer une application React de **catalogue de films** en utilisant shadcn/ui.

## Exigences

### Barre de navigation

- Afficher une barre de navigation avec `NavigationMenu`
- Inclure au minimum :
    - Un lien **Accueil**
    - Un menu déroulant **Genres** avec au moins 3 sous-catégories (ex. : Action, Comédie, Drame)

### Grille de films

- Afficher une grille de films avec la composante `Card`
- Chaque carte doit contenir :
    - Le titre du film
    - L'année de sortie
    - Le genre affiché avec un `Badge`
    - Une courte description
    - Un bouton **Voir les détails**
- La grille doit contenir au moins 4 films de départ
- La mise en page doit être responsive (1 colonne sur mobile, 2 sur tablette, 4 sur grand écran)

### Formulaire d'ajout

- Afficher un formulaire permettant d'ajouter un nouveau film à la grille
- Utiliser `react-hook-form` avec la validation `zod`
- Utiliser `Controller` de react-hook-form avec les composantes `Field`, `FieldLabel` et `FieldError` de shadcn/ui
- Les champs du formulaire :
    - **Titre** (obligatoire, minimum 2 caractères)
    - **Année** (obligatoire, entre 1888 et l'année courante)
    - **Genre** (obligatoire, minimum 3 caractères)
    - **Description** (obligatoire, minimum 10 caractères)
- Lorsque le formulaire est soumis avec des données valides, le nouveau film s'ajoute dans la grille
- Après la soumission, le formulaire se réinitialise
