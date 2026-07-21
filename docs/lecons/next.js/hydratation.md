# Hydratation dans Next.js

## Qu'est-ce que l'hydratation

Le HTML envoyé par Next.js ne contient pas les gestionnaires d'événements de React. Pour que React "réagisse", il faut connecter tous les gestionnaires d'événement (le javascript) au HTML envoyé par Next.JS.

### Le cycle complet d'une page Next.js

```
1. Serveur  → génère le HTML  
2. Navigateur → reçoit et affiche le HTML (page visible mais non interactive)
3. React    → « hydrate » le HTML en y attachant les événements JS (page interactive)
```

Sans hydratation, la page serait visible mais aucun bouton, formulaire ou interaction ne fonctionnerait.

## Comment fonctionne l'hydratation

Lors de l'hydratation, React prend le DOM venant du serveur et le compare au DOM Virtuel que le code aurait produit du côté client. Si les deux correspondent parfaitement, React attache simplement ses événements sans recréer les éléments. C'est ce qu'on appelle la **réconciliation**.

```
HTML du serveur :  <button>Compteur : 0</button>
React côté client :  <button>Compteur : 0</button>

Correspondance — React attache onClick sans toucher au DOM
```

### Server Components vs Client Components

Dans Next.js, tous les composants sont rendus côté serveur et ne s'hydratent pas — ils n'ont pas de JavaScript interactif. Seuls les composants clients (marqués `"use client"`) passent par l'hydratation.

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

