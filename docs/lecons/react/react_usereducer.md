# useReducer

`useReducer` est un hook React qui permet de gérer des états complexes. C'est une alternative à `useState` lorsque la logique de mise à jour implique plusieurs valeurs liées ou plusieurs types d'actions différentes.

!!! manuel
    [useReducer - Documentation](https://react.dev/reference/react/useReducer)

## Quand utiliser useReducer?

- L'état suivant dépend de l'état précédent
- Plusieurs actions différentes modifient l'état
- La logique de mise à jour est complexe ou imbriquée
- Vous souhaitez centraliser et tester la logique de l'état séparément

## Syntaxe

``` ts
const [state, dispatch] = useReducer(reducer, etatInitial);
```

## Les concepts clés

### Le réducteur (reducer)

C'est une **fonction pure** qui prend l'état actuel et une action, puis retourne le nouvel état. Elle ne doit **jamais** modifier directement l'état, mais toujours retourner un nouvel objet.

``` ts
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENTER':
      return { ...state, compte: state.compte + 1 };
    default:
      return state;
  }
}
```

### L'action (action)

Un objet qui décrit ce qui s'est passé. Il possède toujours une propriété `type` et, au besoin, des données supplémentaires dans `payload`.

``` ts
{ type: 'INCREMENTER' }
{ type: 'AJOUTER_ITEM', payload: { nom: 'Pomme' } }
```

### dispatch

La fonction `dispatch` envoie une action au réducteur pour déclencher une mise à jour de l'état.

``` ts
dispatch({ type: 'INCREMENTER' });
dispatch({ type: 'AJOUTER_ITEM', payload: { nom: 'Pomme' } });
```

## Exemple simple — Compteur

``` ts
import { useReducer } from 'react';

type State = { compte: number };
type Action =
  | { type: 'incrementer' }
  | { type: 'decrementer' }
  | { type: 'reinitialiser' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'incrementer':
      return { compte: state.compte + 1 };
    case 'decrementer':
      return { compte: state.compte - 1 };
    case 'reinitialiser':
      return { compte: 0 };
    default:
      return state;
  }
}

function Compteur() {
  const [state, dispatch] = useReducer(reducer, { compte: 0 });

  return (
    <>
      <p>Compte : {state.compte}</p>
      <button onClick={() => dispatch({ type: 'incrementer' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrementer' })}>-</button>
      <button onClick={() => dispatch({ type: 'reinitialiser' })}>Réinitialiser</button>
    </>
  );
}

export default Compteur;
```

## Exemple avec payload — Liste de tâches

``` ts
import { useReducer, useState } from 'react';

type Tache = { id: number; texte: string; complete: boolean };

type Action =
  | { type: 'ajouter'; payload: string }
  | { type: 'completer'; payload: number }
  | { type: 'supprimer'; payload: number };

function reducer(state: Tache[], action: Action): Tache[] {
  switch (action.type) {
    case 'ajouter':
      return [...state, { id: Date.now(), texte: action.payload, complete: false }];
    case 'completer':
      return state.map(t =>
        t.id === action.payload ? { ...t, complete: !t.complete } : t
      );
    case 'supprimer':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
}

function ListeTaches() {
  const [taches, dispatch] = useReducer(reducer, []);
  const [texte, setTexte] = useState('');

  const handleAjouter = () => {
    if (texte.trim()) {
      dispatch({ type: 'ajouter', payload: texte });
      setTexte('');
    }
  };

  return (
    <div>
      <input
        value={texte}
        onChange={e => setTexte(e.target.value)}
        placeholder="Nouvelle tâche..."
      />
      <button onClick={handleAjouter}>Ajouter</button>
      <ul>
        {taches.map(tache => (
          <li key={tache.id}>
            <span style={{ textDecoration: tache.complete ? 'line-through' : 'none' }}>
              {tache.texte}
            </span>
            <button onClick={() => dispatch({ type: 'completer', payload: tache.id })}>
              ✓
            </button>
            <button onClick={() => dispatch({ type: 'supprimer', payload: tache.id })}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeTaches;
```

## useState vs useReducer

| Situation | useState | useReducer |
|-----------|:--------:|:----------:|
| État simple (nombre, chaîne, booléen) | ✅ | |
| Plusieurs états indépendants | ✅ | |
| État complexe (objets imbriqués) | | ✅ |
| Plusieurs actions qui modifient l'état | | ✅ |
| Logique facile à tester isolément | | ✅ |
| L'état suivant dépend du précédent | | ✅ |

## useReducer avec useContext

`useReducer` et `useContext` s'associent naturellement pour créer un état global accessible partout dans l'application, tout en gardant la logique centralisée.

``` ts title="taches.context.tsx"
import { createContext, useContext, useReducer } from 'react';

type Tache = { id: number; texte: string; complete: boolean };

type Action =
  | { type: 'ajouter'; payload: string }
  | { type: 'completer'; payload: number }
  | { type: 'supprimer'; payload: number };

function reducer(state: Tache[], action: Action): Tache[] {
  switch (action.type) {
    case 'ajouter':
      return [...state, { id: Date.now(), texte: action.payload, complete: false }];
    case 'completer':
      return state.map(t =>
        t.id === action.payload ? { ...t, complete: !t.complete } : t
      );
    case 'supprimer':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
}

type TachesContextType = {
  taches: Tache[];
  dispatch: React.Dispatch<Action>;
};

const TachesContext = createContext<TachesContextType | null>(null);

export function TachesProvider({ children }: { children: React.ReactNode }) {
  const [taches, dispatch] = useReducer(reducer, []);
  return (
    <TachesContext.Provider value={{ taches, dispatch }}>
      {children}
    </TachesContext.Provider>
  );
}

export function useTaches() {
  const context = useContext(TachesContext);
  if (!context) throw new Error('useTaches doit être utilisé dans un TachesProvider');
  return context;
}
```

``` ts title="App.tsx"
import { TachesProvider } from './taches.context';
import ListeTaches from './ListeTaches';

function App() {
  return (
    <TachesProvider>
      <ListeTaches />
    </TachesProvider>
  );
}
```

``` ts title="ListeTaches.tsx"
import { useTaches } from './taches.context';

function ListeTaches() {
  const { taches, dispatch } = useTaches();

  return (
    <ul>
      {taches.map(tache => (
        <li key={tache.id}>
          {tache.texte}
          <button onClick={() => dispatch({ type: 'supprimer', payload: tache.id })}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}
```

!!! tip
    En combinant `useReducer` et `useContext`, vous obtenez un patron de gestion d'état qui ressemble à Redux, mais sans dépendance externe.

## useReducer avec Immer

La règle principale du réducteur est de ne **jamais** muter l'état directement, mais toujours retourner un nouvel objet. Avec des états complexes et imbriqués, cela force l'utilisation de nombreux spread operators (`...`) qui alourdissent le code.

[Immer](../outils/immer.md) résout ce problème en permettant d'écrire les mutations directement sur un objet `draft`, tout en produisant un nouvel état immuable en arrière-plan.

### Installation

``` nodejsrepl title="console"
npm install immer
```

### Comparaison sans et avec Immer

Prenons le réducteur de la liste de tâches :

=== "Sans Immer"

    ``` ts
    function reducer(state: Tache[], action: Action): Tache[] {
      switch (action.type) {
        case 'ajouter':
          return [...state, { id: Date.now(), texte: action.payload, complete: false }];
        case 'completer':
          return state.map(t =>
            t.id === action.payload ? { ...t, complete: !t.complete } : t
          );
        case 'supprimer':
          return state.filter(t => t.id !== action.payload);
        default:
          return state;
      }
    }
    ```

=== "Avec Immer"

    ``` ts
    import { produce } from 'immer';

    const reducer = produce((draft: Tache[], action: Action) => {
      switch (action.type) {
        case 'ajouter':
          draft.push({ id: Date.now(), texte: action.payload, complete: false });
          break;
        case 'completer': {
          const tache = draft.find(t => t.id === action.payload);
          if (tache) tache.complete = !tache.complete;
          break;
        }
        case 'supprimer': {
          const index = draft.findIndex(t => t.id === action.payload);
          if (index !== -1) draft.splice(index, 1);
          break;
        }
      }
    });
    ```

### Utilisation avec useReducer

Le réducteur produit par Immer s'utilise exactement comme un réducteur normal :

``` ts
function ListeTaches() {
  const [taches, dispatch] = useReducer(reducer, []);

  // dispatch fonctionne exactement pareil
  dispatch({ type: 'ajouter', payload: 'Faire les courses' });
  dispatch({ type: 'completer', payload: 42 });
  dispatch({ type: 'supprimer', payload: 42 });
}
```

!!! tip
    Avec Immer, on utilise `break` à la fin de chaque `case` au lieu de `return`, puisqu'on ne retourne plus un nouvel objet manuellement. Immer s'occupe de construire l'état final à partir des mutations du `draft`.
