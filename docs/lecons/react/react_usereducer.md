# useReducer


Lorsque votre état est complexe (un objet avec beaucoup de propriétés, une liste d'objets, etc...) et que vous avez potentiellement beaucoup d'actions à faire sur cet état, la gestion de l'état un peu éparpillée dans votre application peut rendre le tout fragile. Le hook `useReducer` a été pensé pour aider avec ce genre de complexité. 

!!! manuel
    [useReducer - Documentation](https://react.dev/reference/react/useReducer)

## Quand utiliser useReducer?

Il est recommandé d'utiliser un réducteur lorsque l'état suivant est une modification de l'état précédent, lorsqu'il y a plusieurs actions possibles sur l'état, lorsque la logique est complexe ou lorsque vous souhaiter centraliser la gestion complète de l'état.


## Syntaxe

``` ts
const [state, dispatch] = useReducer(reducer, etatInitial);
```

## Les concepts clés

### Le réducteur (reducer)

C'est une fonction qui prend l'état actuel et une action, puis retourne le nouvel état. Elle ne doit pas modifier directement l'état, mais toujours retourner un nouvel objet. (Voir la leçon sur la mécanique de React)

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

## useReducer avec useContext

Vous pouvez facilement combiner `useReducer` et `useContext`. 

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

## useReducer avec Immer
Un bon truc pour faciliter la modification d'un état dans un réducteur et l'utilisation de [Immer](../outils/immer.md).
