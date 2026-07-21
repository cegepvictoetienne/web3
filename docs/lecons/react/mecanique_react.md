# Mécanique de React

Pour une question de performance, les concepteurs de React ont décidé de représenter le DOM d'une page Web dans une structure en mémoire, indépendante du DOM actuel. Dans la parlance React, c'est le DOM Virtuel.

Pour faire une histoire courte, React fait tous les changements dans le DOM Virtuel, le compare au DOM Réel et fait une mise à jour ciblée. Ça minimise les changements au DOM Réel.

!!! manuel
    [Comprendre la réconciliation](https://react.dev/learn/preserving-and-resetting-state)

---

## Le cycle de rendu

Un composant React se **rend** (render) lorsque :

- Il est affiché pour la première fois (montage)
- Son état (`useState`) change
- Ses `props` changent
- Son composant parent se re-rend

### Animation interactive — le cycle complet

<iframe src="./cycle_rendu_react.html" style="width:100%;height:800px;border:none;border-radius:12px;"></iframe>


### Exemple : visualiser les rendus

```tsx title="Compteur.tsx"
import { useState } from "react";

function Compteur() {
  const [compte, setCompte] = useState(0);

  console.log("Rendu du composant"); 

  return (
    <div>
      <p>Compte : {compte}</p>
      <button onClick={() => setCompte(compte + 1)}>+1</button>
    </div>
  );
}
```

---

## Les états immuables

Modifier une variable d'état directement n'a aucun impact dans le DOM, car React ne réagit pas aux changements de valeurs, mais aux changements de référence des variables. (C'est comme changer l'adresse d'un pointeur en C++)

Dans l'exemple suivant, le score reste à 0 pour Alice, car l'objet reste le même.

```tsx 
const [joueur, setJoueur] = useState({ nom: "Alice", score: 0 });


joueur.score = 10;
setJoueur(joueur); 
```

Avec le `...`, on crée un nouvel objet, React voit une nouvelle référence, donc la page Web réflète le changement.

```tsx
const [joueur, setJoueur] = useState({ nom: "Alice", score: 0 });

setJoueur({ ...joueur, score: 10 });
```

!!! manuel
    [Mettre à jour les objets dans le state](https://react.dev/learn/updating-objects-in-state)

    [Mettre à jour les tableaux dans le state](https://react.dev/learn/updating-arrays-in-state)
