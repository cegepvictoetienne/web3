# TypeScript 2 - Concepts avancés  

## Décomposition  

Voici quelques trucs de TypeScript pour manipuler les données de tableaux. La décomposition permet d'extraire une ou plusieurs valeurs d'un tableau dans des variables séparées.


Lors de la création de variables (const ...), si on utilise les crochets dans les variables, on peut assigner un tableau et transférer les éléments dans les variables.

Ex: 

Partons d'un tableau comme celui-ci :  

```typescript
const nombres: number[] = [10, 20, 30, 40];

```  

Si on veut avoir les deux premières valeurs, on peut écrire la création des variables comme ceci :

```typescript
const [premier, deuxieme] = nombres;
```

Si on veut le premier et le troisième, écrire ceci :  

```typescript
const [premier, , troisieme] = nombres;
```

Si on veut les deux premiers éléments séparés et un tableau avec les éléments restants :  

```typescript
const [premier, deuxieme, ...reste] = nombres;
```

Maitenant, prenons ce nouveau tableau contenant une valeur indéfinie :  

```typescript
const monTableau: (number | undefined)[] = [10, undefined];
``` 

On peut informer TypeScript de remplacer des valeurs indéfinies par une valeur par défaut : 

```typescript

const [a = 1, b = 20] = monTableau;
```
(Dans l'exemple précédent, a = 10 et b = 20)

On peut aussi décomposer un objet en variables séparées.

Ex :  

```typescript
interface Utilisateur {
  nom: string;
  age: number;
}

const utilisateur: Utilisateur = {
  nom: 'Alice',
  age: 30
};

const { nom, age } = utilisateur;
```

Si on veut extraire quelques variables, mais garder le reste dans un autre objet :  

```typescript
const utilisateur = {
  nom: 'David',
  age: 40,
  ville: 'Paris',
  pays: 'France'
};

const { nom, age, ...details } = utilisateur;
```

On peut aussi utiliser l'opérateur `...` pour copier le contenu d'un objet ou tableau :  

``` typescript  
  const tableau = [1, 2, 3, 4, 5, 6];

  const nouveauTableau = [...tableau, 7, 8, 9];

  // Le nouveauTableau sera : [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // à une nouvelle adresse.

```

``` typescript  
   const ancienObjet = {
    id: 2,
    nom: "Michael",
   };

   const nouvelObjet = {...ancienObjet, id: 3};

   // Le nouvel objet sera :  
   // { id: 3, nom: "Michael" }
   // L'objet sera à une nouvelle adresse mémoire  

``` 


## Manipulations de tableaux

Typescript offre des fonctions très puissantes pour manipuler des tableaux. Regardons quelques exemples :

Disons que je veuille copier un tableau tout en appliquant une formule. On pourrait utiliser une boucle, mais ce serait lourd.  La fonction `map` permet de faire ça de manière concise.  


```typescript
const mesChats: string[] = ['ROGER', 'FANTA', 'OLIVE', 'GUIZMO'];

const mesChatsEnMinuscule: string[] = mesChats.map((n) => n.toLowerCase());
```

Quelles valeurs seront dans le tableau mesChatsEnMinuscule?

Avec des objets :

```typescript
interface Chat {
  id: number;
  nom: string;
  race: string;
  sexe: string;
}

const mesChats: Chat[] = [
  { id: 1, nom: 'Roger', race: 'Orange', sexe: 'M'},
  { id: 2, nom: 'Fanta', race: 'Ragdoll', sexe: 'M' },
];

const tableauDeNomDeChat: string[] = mesChats.map((p) => p.nom);
```

Parfois, nous voulons parcourir l'ensemble d'un tableau pour vérifier si chaque élément correspond à une condition. C'est fait avec `every`. Si on veut vérifier qu'au moins un élément correspond à une condition, on utilise `some`.

Ex:  

```typescript
interface Chat {
  id: number;
  nom: string;
  race: string;
  sexe: string;
}

const mesChats: Chat[] = [
  { id: 1, nom: 'Roger', race: 'Orange', sexe: 'M'},
  { id: 2, nom: 'Fanta', race: 'Ragdoll', sexe: 'M' },
];

const tousLesChatsSontMales: boolean = mesChats.every((p) => p.sexe === 'M');
const auMoinsUnChatEstOrange: boolean = mesChats.some((p) => p.race === 'Orange');
```

Si on veut enlever des éléments d'un tableau qui ne correspondent pas à une condition, utilisons `filter`: 

```typescript
interface Chat {
  id: number;
  nom: string;
  race: string;
  sexe: string;
}

const mesChats: Chat[] = [
  { id: 1, nom: 'Roger', race: 'Orange', sexe: 'M'},
  { id: 2, nom: 'Fanta', race: 'Ragdoll', sexe: 'M' },
  { id: 3, nom: 'Olive', race: 'Devon Rex', sexe: 'F'},
];

const mesChatsMales : Chat[] = mesChats.filter( (p) => p.sexe === 'M');
```

Si on veut seulement le premier élément qui correspond à une condition, alors `find` est plus approprié :  

La méthode `find` retourne le premier élément qui satisfait une condition, ou `undefined` si aucun élément ne correspond.


```typescript
interface Chat {
  id: number;
  nom: string;
  race: string;
  sexe: string;
}

const mesChats: Chat[] = [
  { id: 1, nom: 'Roger', race: 'Orange', sexe: 'M'},
  { id: 2, nom: 'Fanta', race: 'Ragdoll', sexe: 'M' },
  { id: 3, nom: 'Olive', race: 'Devon Rex', sexe: 'F'},
];

const monChatOrange : Chat[] = mesChats.find( (p) => p.race === 'Orange');
```

##  L'opérateur conditionnel (ternaire)

``` javascript
   const valeur = id === 0 ? "allo" : "hello";
```  

Comment interpréter ce code : SI id est égale à 0, valeur devient 'allo', sinon valeur devient 'hello'.

