# TypeScript 2 - Concepts avancés  



## TODO : Décomposition  

La décomposition est une syntaxe puissante en TypeScript (et JavaScript ES6+) qui permet d'extraire des valeurs de tableaux ou des propriétés d'objets dans des variables distinctes. Cela rend le code plus concis et plus lisible.

## 1. Décomposition de tableaux

La décomposition de tableaux permet d'extraire des éléments d'un tableau en se basant sur leur position.

### Syntaxe de base

Vous pouvez assigner les éléments d'un tableau à des variables individuelles.

```typescript
const nombres: number[] = [10, 20, 30, 40];

const [premier, deuxieme] = nombres;

console.log(premier); // Affiche 10
console.log(deuxieme); // Affiche 20
```

### Ignorer des éléments

Si vous n'avez pas besoin de tous les éléments, vous pouvez en ignorer certains en utilisant une virgule.

```typescript
const nombres: number[] = [10, 20, 30];

const [premier, , troisieme] = nombres;

console.log(premier); // Affiche 10
console.log(troisieme); // Affiche 30
```

### L'opérateur de reste (`...rest`)

L'opérateur de reste permet de collecter les éléments restants d'un tableau dans un nouveau tableau.

```typescript
const nombres: number[] = [10, 20, 30, 40, 50];

const [premier, deuxieme, ...reste] = nombres;

console.log(premier); // Affiche 10
console.log(deuxieme); // Affiche 20
console.log(reste); // Affiche [30, 40, 50]
```

### Valeurs par défaut

Vous pouvez fournir des valeurs par défaut au cas où un élément du tableau serait `undefined`.

```typescript
const monArray: (number | undefined)[] = [10, undefined];

const [a = 1, b = 20] = monArray;

console.log(a); // Affiche 10
console.log(b); // Affiche 20
```

## 2. Décomposition d'objets

La décomposition d'objets permet d'extraire des propriétés d'un objet en se basant sur leur nom.

### Syntaxe de base

Extrayez les propriétés d'un objet dans des variables portant le même nom.

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

console.log(nom); // Affiche 'Alice'
console.log(age); // Affiche 30
```

### Renommer avec des alias

Si vous souhaitez que vos variables aient un nom différent de celui des propriétés, vous pouvez utiliser des alias.

```typescript
const utilisateur = {
  nom: 'Bob',
  age: 25
};

const { nom: nomUtilisateur, age: ageUtilisateur } = utilisateur;

console.log(nomUtilisateur); // Affiche 'Bob'
console.log(ageUtilisateur); // Affiche 25
```

### Valeurs par défaut

Tout comme pour les tableaux, vous pouvez définir des valeurs par défaut pour les propriétés qui pourraient ne pas exister sur l'objet.

```typescript
const utilisateur = {
  nom: 'Charlie'
};

const { nom, age = 20 } = utilisateur;

console.log(nom); // Affiche 'Charlie'
console.log(age); // Affiche 20
```

### L'opérateur de reste (`...rest`)

L'opérateur de reste peut également être utilisé pour collecter les propriétés restantes d'un objet dans un nouvel objet.

```typescript
const utilisateur = {
  nom: 'David',
  age: 40,
  ville: 'Paris',
  pays: 'France'
};

const { nom, age, ...details } = utilisateur;

console.log(nom); // Affiche 'David'
console.log(age); // Affiche 40
console.log(details); // Affiche { ville: 'Paris', pays: 'France' }
```

## 3. Utilisations typiques de la décomposition

La décomposition est particulièrement utile dans plusieurs scénarios courants.

### Paramètres de fonction

La décomposition des objets en paramètres de fonction améliore considérablement la lisibilité.

```typescript
interface Options {
  largeur: number;
  hauteur: number;
  couleur?: string;
}

function creerFenetre({ largeur, hauteur, couleur = 'blanc' }: Options): void {
  console.log(`Création d'une fenêtre de ${largeur}x${hauteur} de couleur ${couleur}.`);
}

const options = { largeur: 800, hauteur: 600 };
creerFenetre(options); // Affiche "Création d'une fenêtre de 800x600 de couleur blanc."
```

### Décomposition imbriquée

Vous pouvez décomposer des objets et des tableaux imbriqués pour accéder à des données plus profondes.

```typescript
const produit = {
  id: 123,
  nom: 'Ordinateur portable',
  details: {
    fabricant: 'MarqueX',
    specs: ['16GB RAM', '512GB SSD']
  }
};

const {
  nom,
  details: {
    fabricant,
    specs: [ram]
  }
} = produit;

console.log(nom); // Affiche 'Ordinateur portable'
console.log(fabricant); // Affiche 'MarqueX'
console.log(ram); // Affiche '16GB RAM'
```

### Utilisation dans les boucles

La décomposition est très pratique lors de l'itération sur des tableaux d'objets.

```typescript
const utilisateurs = [
  { id: 1, nom: 'Eve' },
  { id: 2, nom: 'Frank' }
];

for (const { id, nom } of utilisateurs) {
  console.log(`Utilisateur ${id} : ${nom}`);
}
// Affiche :
// Utilisateur 1 : Eve
// Utilisateur 2 : Frank
```

### Échanger des variables

Une astuce concise pour échanger les valeurs de deux variables sans utiliser de variable temporaire.

```typescript
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // Affiche 2
console.log(b); // Affiche 1
```

### Pour copier un tableau  

``` typescript  
  const tableau = [1, 2, 3, 4, 5, 6];

  const nouveauTableau = [...tableau, 7, 8, 9];

  // Le nouveauTableau sera : [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // à une nouvelle adresse.

```

### Pour copier un objet et changer une valeur  

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


## TODO : Manipulations de tableaux

### map  
### every  
### some  
### reduce  

## TODO : L'**opérateur conditionnel (ternaire)**.

``` javascript
   const valeur = id === 0 ? "allo" : "hello";
```  

C'est le seul opérateur JavaScript qui prend trois opérandes :

1.  **Une condition** : `id === 0`
2.  **Une expression à exécuter si la condition est vraie** : `"allo"`
3.  **Une expression à exécuter si la condition est fausse** : `"hello"`

Cet opérateur est souvent utilisé comme un raccourci pour une instruction `if...else`. Dans l'exemple, si la variable `id` est égale à `0`, l'opération retournera la chaîne de caractères `"allo"`. Sinon, elle retournera `"hello"`.
