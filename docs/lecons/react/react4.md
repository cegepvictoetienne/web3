# Se connecter à un API  

Il est préférable d’utiliser la librairie Axios pour aller chercher vos données de l’API :

``` ts title="fetch_bieres.ts"
axios.get('https://bieres.profinfo.ca/api/bieres').then((response) => {
  setListeBieres(response.data.bieres);
});
```

!!! manuel  
    [Axios - Documentation](https://axios-http.com/docs/intro)  


## Le problème : trop d'appels à l'API

Lorsqu'on connecte un champ de recherche à un API, chaque frappe de clavier déclenche un appel. Si l'utilisateur tape « bière », ça génère 5 appels : `b`, `bi`, `biè`, `bièr`, `bière`.

``` tsx title="SearchBar.tsx"
// Problème : appel à chaque caractère tapé
function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    // Cet appel se fait à chaque frappe!
    axios.get(`/api/bieres?q=${e.target.value}`).then(/* ... */);
  }

  return <input value={query} onChange={handleChange} />;
}
```

## L'anti-rebond (debounce)

L'**anti-rebond** est une technique qui attend que l'utilisateur arrête de taper pendant un certain délai avant de déclencher l'appel. Si l'utilisateur tape dans ce délai, le minuteur repart à zéro.

``` 
Utilisateur tape : b → bi → biè → bièr → bière
                   ↑    ↑    ↑     ↑      ↑
                   ⏱️  ⏱️reset ⏱️reset  ⏱️reset  ✅ appel après 500ms
```

## Implémenter l'anti-rebond avec useEffect

La façon la plus simple est d'utiliser `useEffect` avec `setTimeout` et une fonction de ménage :

``` tsx title="SearchBar.tsx"
import { useState, useEffect } from 'react';
import axios from 'axios';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [resultats, setResultats] = useState([]);

  useEffect(() => {
    // Ne pas appeler si la recherche est vide
    if (query.trim() === '') {
      setResultats([]);
      return;
    }

    // Démarrer un minuteur de 500ms
    const minuteur = setTimeout(() => {
      axios.get(`/api/bieres?q=${query}`).then((response) => {
        setResultats(response.data.bieres);
      });
    }, 500);

    // Le ménage annule le minuteur si query change avant 500ms
    return () => clearTimeout(minuteur);
  }, [query]); // Se déclenche à chaque changement de query

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une bière..."
      />
      <ul>
        {resultats.map((biere) => (
          <li key={biere.id}>{biere.nom}</li>
        ))}
      </ul>
    </>
  );
}
```

Le secret est dans la **fonction de ménage** : chaque fois que `query` change, React annule le `setTimeout` précédent avant d'en créer un nouveau. L'appel API ne part que si 500ms s'écoulent sans changement.

## Extraire dans un hook personnalisé

Si plusieurs composants ont besoin d'anti-rebond, on peut l'extraire dans un hook réutilisable :

``` tsx title="hooks/useDebounce.ts"
import { useState, useEffect } from 'react';

function useDebounce<T>(valeur: T, delai: number): T {
  const [valeurDebouncee, setValeurDebouncee] = useState(valeur);

  useEffect(() => {
    const minuteur = setTimeout(() => {
      setValeurDebouncee(valeur);
    }, delai);

    return () => clearTimeout(minuteur);
  }, [valeur, delai]);

  return valeurDebouncee;
}
```

``` tsx title="SearchBar.tsx"
function SearchBar() {
  const [query, setQuery] = useState('');
  const queryDebouncee = useDebounce(query, 500);

  useEffect(() => {
    if (queryDebouncee.trim() === '') return;

    axios.get(`/api/bieres?q=${queryDebouncee}`).then((response) => {
      // ...
    });
  }, [queryDebouncee]); // L'appel ne se fait que quand la valeur debounced change

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```


