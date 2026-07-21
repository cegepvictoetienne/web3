# Immer

Chaque problématique a une module pour y répondre. Le module Immer a été conçu pour faciliter l'écriture de changements de variables immuables sans le tracas d'utiliser l'opérateur `...`.

!!! manuel
    [Immer - Documentation](https://immerjs.github.io/immer/)

## Le problème qu'Immer résout

Imaginez le code suivant, tout ça pour seulement une modification d'une propriété imbriquée :  

``` ts
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
return produce(state, draft => {
  draft.utilisateur.adresse.ville = 'Montréal';
});
```

## Installation

``` nodejsrepl title="console"
npm install immer
```

## La fonction produce

`produce` est la fonction principale d'Immer. Le premier paramètre est l'état actuel. Le second paramètre est une fonction qui reçoit un brouillon (un draft) qui est modifié directement. 

``` ts
import { produce } from 'immer';

const nouvelEtat = produce(etatActuel, draft => {
  // Modifier le draft comme si c'était un objet normal
  draft.propriete = 'nouvelle valeur';
});
```

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
