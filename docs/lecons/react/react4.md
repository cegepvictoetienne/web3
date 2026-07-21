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

Imaginez un champ de recherche où on désire que les résultats apparaîssent dès que l'utilisateur entre ses termes de recherche. On peut penser que simplement se connecter à onChange du champ de recherche et de faire l'appel de l'API serait suffisant, mais un problème survient rapidement : à chaque touche pressée, l'évènement onChange se déclenche, faisant un appel à l'API. 

Exemple : 

 Si l'utilisateur tape « bière », ça génère 5 appels : `b`, `bi`, `biè`, `bièr`, `bière`.

``` tsx title="SearchBar.tsx"
// Problème : appel à chaque caractère tapé
function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    axios.get(`/api/bieres?q=${e.target.value}`).then(/* ... */);
  }

  return <input value={query} onChange={handleChange} />;
}
```

## L'anti-rebond (debounce)

Une technique simple a été développée pour réduire le nombre d'appel à l'API. C'est l'anti-rebond. L'idée est d'attendre quelques millisecondes après un évènement onChange et si aucun autre changement se produit, faire l'appel de l'API. Ça marche la plupart du temps, car une personne moyenne prend moins d'une seconde pour entrer une lettre. 

Donc, au lieu de faire l'appel directement de l'API dans le onChange, on démarre un minuteur qui fait l'appel dans 500 millisecondes. Si une autre touche est pressée, on annule le minuteur et on en relance un autre. 


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

Le secret est dans la fonction de ménage (celle retounée par le useEffect) : chaque fois que `query` change, React annule le `setTimeout` précédent avant d'en créer un nouveau. L'appel API ne part que si 500ms s'écoulent sans changement.

