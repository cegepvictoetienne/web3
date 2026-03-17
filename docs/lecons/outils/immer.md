# Immer

Immer est une librairie qui simplifie la manipulation d'état **immuable**. Elle vous permet d'écrire du code qui ressemble à une mutation directe de l'état, mais produit en réalité un nouvel objet immuable en arrière-plan.

!!! manuel
    [Immer - Documentation](https://immerjs.github.io/immer/)

## Le problème qu'Immer résout

Dans React, on ne modifie jamais directement l'état — on retourne toujours un nouvel objet. Avec des structures imbriquées, cela devient vite verbeux :

``` ts
// Sans Immer — beaucoup de spread operators
return {
  ...state,
  utilisateur: {
    ...state.utilisateur,
    adresse: {
      ...state.utilisateur.adresse,
      ville: 'Montréal',
    },
  },
};
```

Avec Immer, on peut écrire directement :

``` ts
// Avec Immer — lisible et concis
return produce(state, draft => {
  draft.utilisateur.adresse.ville = 'Montréal';
});
```

## Installation

``` nodejsrepl title="console"
npm install immer
```

## La fonction produce

`produce` est la fonction principale d'Immer. Elle prend l'état actuel et une fonction de « recette » qui reçoit un objet `draft` (brouillon) que l'on peut muter librement.

``` ts
import { produce } from 'immer';

const nouvelEtat = produce(etatActuel, draft => {
  // Modifier le draft comme si c'était un objet normal
  draft.propriete = 'nouvelle valeur';
});
```

!!! note
    Immer utilise les `Proxy` JavaScript pour intercepter les mutations du `draft` et construire un nouvel objet immuable. L'état original n'est **jamais** modifié.

## Exemples de base

### Modifier une propriété

``` ts
import { produce } from 'immer';

const etat = { nom: 'Alice', age: 30 };

const nouvelEtat = produce(etat, draft => {
  draft.age = 31;
});

console.log(etat.age);      // 30 — inchangé
console.log(nouvelEtat.age); // 31
```

### Ajouter un élément à un tableau

``` ts
const etat = { items: ['pomme', 'banane'] };

const nouvelEtat = produce(etat, draft => {
  draft.items.push('cerise');
});
```

### Supprimer un élément

``` ts
const etat = { items: ['pomme', 'banane', 'cerise'] };

const nouvelEtat = produce(etat, draft => {
  draft.items.splice(1, 1); // Supprimer 'banane'
});
```

### Modifier un objet imbriqué

``` ts
const etat = {
  utilisateur: {
    nom: 'Alice',
    adresse: { ville: 'Québec', pays: 'Canada' },
  },
};

const nouvelEtat = produce(etat, draft => {
  draft.utilisateur.adresse.ville = 'Montréal';
});
```

## Curried produce (réducteur prêt à l'emploi)

`produce` peut être appelé avec seulement la recette pour créer une **fonction réutilisable**. C'est particulièrement utile avec `useReducer` :

``` ts
import { produce } from 'immer';

// Crée une fonction qui attend l'état en paramètre
const ajouterItem = produce((draft: string[], item: string) => {
  draft.push(item);
});

const liste1 = ['pomme', 'banane'];
const liste2 = ajouterItem(liste1, 'cerise');
// liste1 est toujours ['pomme', 'banane']
// liste2 est ['pomme', 'banane', 'cerise']
```
