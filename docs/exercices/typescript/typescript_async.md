# Exercice - TypeScript 2 et JavaScript asynchrone

## Mise en place

- Créer un dossier `exercice_ts2_async`
- Initialiser TypeScript avec `tsc --init`
- Initialiser Node avec `npm init`
- Créer un script dans `package.json` pour compiler le TypeScript et exécuter le code en mode `watch` :
    - `npm run ts2` pour rouler la partie 1
    - `npm run async` pour rouler la partie 2
  

## Partie 1 - Manipulation de tableaux et décomposition

Prendre le code suivant et compléter chaque item avec les méthodes de tableau et la décomposition.

``` ts title="ts2.ts"
interface Film {
  id: number;
  titre: string;
  annee: number;
  genre: string;
  prix: number;
  disponible: boolean;
}

const films: Film[] = [
  { id: 1, titre: 'Inception', annee: 2010, genre: 'Science-fiction', prix: 9.99, disponible: true },
  { id: 2, titre: 'Interstellar', annee: 2014, genre: 'Science-fiction', prix: 12.99, disponible: false },
  { id: 3, titre: 'Le Seigneur des Anneaux', annee: 2001, genre: 'Fantaisie', prix: 7.99, disponible: true },
  { id: 4, titre: 'Parasite', annee: 2019, genre: 'Thriller', prix: 11.99, disponible: true },
  { id: 5, titre: 'Everything Everywhere All at Once', annee: 2022, genre: 'Science-fiction', prix: 14.99, disponible: false },
];

// 1. Créer un tableau contenant seulement les titres des films
const titres = 'À faire';
console.log('Titres :', titres);
// Résultat attendu : ['Inception', 'Interstellar', 'Le Seigneur des Anneaux', 'Parasite', 'Everything Everywhere All at Once']

// 2. Créer un tableau contenant seulement les films disponibles
const filmsDisponibles = 'À faire';
console.log('Films disponibles :', filmsDisponibles);
// Résultat attendu : [ Inception, Le Seigneur des Anneaux, Parasite ]

// 3.Calculer le prix total de tous les films
const prixTotal = 'À faire';
console.log('Prix total :', prixTotal);
// Résultat attendu : 57.95

// 4. Trouver le film dont l'id est 3
const filmTrouve = 'À faire';
console.log('Film trouvé :', filmTrouve);
// Résultat attendu : { id: 3, titre: 'Le Seigneur des Anneaux', ... }

// 5. Vérifier si tous les films ont un prix inférieur à 20$
const tousMoinsde20 = 'À faire';
console.log('Tous moins de 20$ :', tousMoinsde20);
// Résultat attendu : true

// 6. Vérifier si au moins un film n'est pas disponible
const auMoinsUnIndisponible = 'À faire';
console.log('Au moins un indisponible :', auMoinsUnIndisponible);
// Résultat attendu : true

// 7. Extraire le premier et le dernier film
//    du tableau films, puis afficher leurs titres
// Résultat attendu :
//   Premier film : Inception
//   Dernier film : Everything Everywhere All at Once

// 8. Créer une fonction afficherFilm qui prend un Film en paramètre.
//    - Utiliser la décomposition d'objet dans les paramètres de la fonction
//    - Utiliser l'opérateur ternaire pour afficher "Disponible" ou "Non disponible"
//    - Afficher : "Inception (2010) - Science-fiction - Disponible"
function afficherFilm(film: Film): void {
  console.log("À faire");
}

films.forEach(afficherFilm);
// Résultat attendu :
//   Inception (2010) - Science-fiction - Disponible
//   Interstellar (2014) - Science-fiction - Non disponible
//   Le Seigneur des Anneaux (2001) - Fantaisie - Disponible
//   Parasite (2019) - Thriller - Disponible
//   Everything Everywhere All at Once (2022) - Science-fiction - Non disponible
```

## Partie 2 - JavaScript asynchrone

Ajouter le code suivant au fichier et compléter chaque item.

L'API [JSONPlaceholder](https://jsonplaceholder.typicode.com) est une fausse API REST gratuite utilisée pour les tests et le prototypage. Elle ne requiert aucune clé d'API.

``` ts title="async.ts"
interface Utilisateur {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
  };
}

// 9. Créer une fonction async obtenirUtilisateurs qui :
//    - Récupère les utilisateurs depuis https://jsonplaceholder.typicode.com/users
//    - Retourne un tableau d'Utilisateur
//    - Gère les erreurs HTTP (response.ok) et les erreurs réseau (try/catch)
async function obtenirUtilisateurs(): Promise<Utilisateur[]> {
  // À faire
}

// 10. Créer une fonction async principale qui :
//     - Appelle obtenirUtilisateurs()
//     - Avec map, crée un tableau de chaînes de caractères au format "nom (ville)"
//       en utilisant la décomposition dans le paramètre de la fonction fléchée
//     - Affiche chaque résultat dans la console
// Résultat attendu (extrait) :
//   Leanne Graham (Gwenborough)
//   Ervin Howell (Wisokyburgh)
//   Clementine Bauch (McKenziehaven)
//   ...
async function principale(): Promise<void> {
  // À faire
}

principale();
```
