# Hydratation dans Next.js

## Qu'est-ce que l'hydratation

L'**hydratation** est le processus par lequel React « prend en charge » un HTML statique déjà rendu par le serveur et y attache les gestionnaires d'événements et l'état JavaScript côté client.

### Le cycle complet d'une page Next.js

```
1. Serveur  → génère le HTML (SSR / SSG)
2. Navigateur → reçoit et affiche le HTML (page visible mais non interactive)
3. React    → « hydrate » le HTML en y attachant les événements JS (page interactive)
```

Sans hydratation, la page serait visible mais aucun bouton, formulaire ou interaction ne fonctionnerait.

!!! tip "Pourquoi c'est important"
    L'hydratation est ce qui donne à Next.js le meilleur des deux mondes : un affichage rapide grâce au HTML du serveur, et une interactivité complète grâce à React côté client.

## Comment fonctionne l'hydratation

Lors de l'hydratation, React parcourt le DOM existant et le compare au résultat que produirait son propre rendu virtuel. Si les deux correspondent parfaitement, React attache simplement ses événements sans recréer les éléments. C'est ce qu'on appelle la **réconciliation**.

```
HTML du serveur :  <button>Compteur : 0</button>
React côté client :  <button>Compteur : 0</button>

Correspondance — React attache onClick sans toucher au DOM
```

### Server Components vs Client Components

Dans Next.js, tous les composants sont **Server Components par défaut** et ne s'hydratent pas — ils n'ont pas de JavaScript interactif. Seuls les **Client Components** (marqués `"use client"`) passent par l'hydratation.

```tsx title="app/compteur/page.tsx"
// Server Component — rendu serveur seulement, pas d'hydratation
export default function Page() {
  return (
    <main>
      <h1>Compteur</h1>
      <BoutonCompteur /> 
    </main>
  );
}
```

```tsx title="app/compteur/BoutonCompteur.tsx"
"use client";

import { useState } from "react";

export default function BoutonCompteur() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Compteur : {count}
    </button>
  );
}
```

## Erreurs d'hydratation courantes

Une **erreur d'hydratation** survient quand le HTML produit par le serveur diffère de ce que React génèrerait côté client. React ne peut pas réconcilier les deux arbres et affiche une erreur.

```
Error: Hydration failed because the initial UI does not match
what was rendered on the server.
```

### 1. Utiliser `Date` ou `Math.random()` dans le rendu

```tsx title="Problématique"
"use client";

export default function Horloge() {
  // Date.now() retourne une valeur différente sur le serveur et le client
  return <p>Heure actuelle : {new Date().toLocaleTimeString()}</p>;
}
```

```tsx title="Correct — useEffect pour les valeurs dynamiques"
"use client";

import { useState, useEffect } from "react";

export default function Horloge() {
  const [heure, setHeure] = useState<string | null>(null);

  useEffect(() => {
    setHeure(new Date().toLocaleTimeString());
  }, []);

  if (!heure) return <p>Chargement...</p>;
  return <p>Heure actuelle : {heure}</p>;
}
```

### 2. Accéder à `window` ou `localStorage` directement

```tsx title="Problématique"
"use client";

export default function Theme() {
  // window n'existe pas côté serveur → erreur
  const theme = window.localStorage.getItem("theme") ?? "clair";
  return <div className={theme}>Contenu</div>;
}
```

```tsx title="Correct — accès dans useEffect"
"use client";

import { useState, useEffect } from "react";

export default function Theme() {
  const [theme, setTheme] = useState("clair");

  useEffect(() => {
    const themeLocal = localStorage.getItem("theme") ?? "clair";
    setTheme(themeLocal);
  }, []);

  return <div className={theme}>Contenu</div>;
}
```

### 3. HTML invalide (balises mal imbriquées)

Le navigateur corrige automatiquement certaines erreurs HTML, ce qui peut créer une divergence avec ce que React attend.

```tsx title="Problématique — <p> dans <p> est invalide en HTML"
export default function Texte() {
  return (
    <p>
      Paragraphe principal
      <p>Sous-paragraphe</p>  {/* HTML invalide */}
    </p>
  );
}
```

```tsx title="Correct — utiliser <div> ou <span>"
export default function Texte() {
  return (
    <div>
      <p>Paragraphe principal</p>
      <p>Sous-paragraphe</p>
    </div>
  );
}
```

### 4. Extensions de navigateur qui modifient le DOM

Certaines extensions (traducteurs, gestionnaires de mots de passe) modifient le DOM avant que React puisse l'hydrater, causant des faux positifs.

!!! warning "Faux positif"
    Si l'erreur d'hydratation disparaît en navigation privée ou en désactivant les extensions, c'est une extension qui cause le problème — pas votre code.

### 5. Données différentes entre serveur et client

```tsx title="Problématique — données aléatoires côté client"
"use client";

export default function ListeAleatoire() {
  // Math.random() donne des résultats différents serveur/client
  const items = [Math.random(), Math.random(), Math.random()];
  return <ul>{items.map((n) => <li key={n}>{n}</li>)}</ul>;
}
```

## Comment éviter les erreurs d'hydratation

| Situation | Solution recommandée |
|---|---|
| Valeur qui dépend du temps | Initialiser avec `null`, mettre à jour dans `useEffect` |
| Accès à `window` / `localStorage` | Toujours dans `useEffect` |
| Contenu différent selon l'utilisateur | Charger côté client avec `useEffect` + état |
| HTML invalide | Valider la structure des balises |


### Utiliser `suppressHydrationWarning`

Pour les cas où la différence est intentionnelle et inoffensive (ex: timestamp formaté) :

```tsx title="Acceptable pour des différences mineures connues"
export default function PiedDePage() {
  return (
    <footer>
      <time suppressHydrationWarning>
        {new Date().getFullYear()}
      </time>
    </footer>
  );
}
```

!!! warning "À utiliser avec parcimonie"
    `suppressHydrationWarning` masque l'avertissement mais ne règle pas le problème. Réserver aux cas où la différence est vraiment sans conséquence.

## Déboguer les erreurs d'hydratation

### 1. Lire le message d'erreur complet

Next.js affiche un message détaillé qui indique **quelle partie** du DOM diffère :

```
Error: Hydration failed because the initial UI does not match
what was rendered on the server.

  Server: <button>Connexion</button>
  Client: <button>Mon compte</button>
```

### 2. Identifier la source de la différence

Cherchez dans votre composant tout ce qui pourrait produire un résultat différent entre le serveur et le client :

- Appels à `Date`, `Math.random()`
- Accès à `window`, `document`, `localStorage`, `navigator`
- Données provenant de cookies ou de l'en-tête HTTP
- Logique conditionnelle basée sur l'environnement (`typeof window !== 'undefined'`)

### 3. Vérifier avec `typeof window`

```tsx title="Problématique — condition différente sur serveur et client"
"use client";

export default function Banner() {
  const estMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return <div>{estMobile ? "Mobile" : "Bureau"}</div>;
}
```

```tsx title="Correct — état initialisé après le montage"
"use client";

import { useState, useEffect } from "react";

export default function Banner() {
  const [estMobile, setEstMobile] = useState(false);

  useEffect(() => {
    setEstMobile(window.innerWidth < 768);
  }, []);

  return <div>{estMobile ? "Mobile" : "Bureau"}</div>;
}
```

### 4. Utiliser les outils React DevTools

React DevTools (extension de navigateur) permet d'inspecter l'arbre de composants et d'identifier quel composant déclenche l'erreur d'hydratation.

### 5. Tester en désactivant JavaScript

Désactiver JavaScript dans le navigateur permet de voir exactement ce que le serveur envoie. Si ce rendu est incohérent avec le comportement attendu de React, c'est là que se trouve le problème.

!!! manuel
    [Documentation Next.js — Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)  
    [React — Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)  
    [Next.js — dynamic imports](https://nextjs.org/docs/app/guides/lazy-loading)
