# Modes de rendu dans Next.js

## Vue d'ensemble

Next.js propose plusieurs façons de générer et d'afficher le contenu d'une page. Ces **modes de rendu** déterminent *quand* et *où* le HTML est produit.

| Mode | Sigle | HTML généré | Moment |
|---|---|---|---|
| Client-Side Rendering | CSR | Dans le navigateur | À chaque visite, côté client |
| Static Site Generation | SSG | Sur le serveur | Une seule fois, à la compilation |
| Incremental Static Regeneration | ISR | Sur le serveur | À la compilation, puis périodiquement |
| Server-Side Rendering | SSR | Sur le serveur | À chaque requête, côté serveur |

## Rendu statique (SSG)

Par défaut, Next.js génère les pages **statiquement** à la compilation (`npm run build`). Le HTML est produit une seule fois et servi directement depuis un CDN. C'est le mode le plus rapide.

``` ts title="app/a-propos/page.tsx (rendu statique)"
export default function AProposPage() {
  return (
    <main>
      <h1>À propos</h1>
      <p>Cette page est générée une seule fois au moment du build.</p>
    </main>
  );
}
```

Quand une page ne contient pas de données dynamiques, Next.js l'optimise automatiquement en rendu statique.

!!! tip "Avantage"
    Le rendu statique est idéal pour les pages dont le contenu change rarement : pages de présentation, documentation, articles de blogue.

## Rendu statique avec données (SSG avec fetch)

On peut aussi générer une page statique qui **récupère des données** au moment du build. La page est quand même générée une seule fois, mais avec des données réelles.

``` ts title="app/produits/page.tsx (SSG avec fetch)"
export default async function ProduitsPage() {
  // Ce fetch s'exécute une seule fois, au moment du build
  const response = await fetch("https://api.exemple.com/produits");
  const produits = await response.json();

  return (
    <main>
      <h1>Produits</h1>
      <ul>
        {produits.map((produit: { id: number; nom: string }) => (
          <li key={produit.id}>{produit.nom}</li>
        ))}
      </ul>
    </main>
  );
}
```

!!! warning "Attention"
    Si les données changent après le build, la page affichera des données obsolètes jusqu'au prochain build.

## Rendu statique incrémentiel (ISR)

L'ISR est un compromis entre SSG et SSR : la page est générée statiquement, mais elle est **régénérée automatiquement** en arrière-plan après un certain délai.

``` ts title="app/produits/page.tsx (ISR)"
export const revalidate = 60; // Régénère la page au maximum toutes les 60 secondes

export default async function ProduitsPage() {
  const response = await fetch("https://api.exemple.com/produits");
  const produits = await response.json();

  return (
    <main>
      <h1>Produits</h1>
      <ul>
        {produits.map((produit: { id: number; nom: string }) => (
          <li key={produit.id}>{produit.nom}</li>
        ))}
      </ul>
    </main>
  );
}
```

On peut aussi définir le délai de revalidation directement dans l'option `next` du `fetch` :

``` ts title="fetch avec revalidation"
const response = await fetch("https://api.exemple.com/produits", {
  next: { revalidate: 60 }, // Revalide les données toutes les 60 secondes
});
```

!!! tip "Avantage"
    L'ISR est idéal pour les pages dont le contenu change régulièrement, mais pas à chaque requête : catalogue de produits, fil d'actualités, classements.

## Rendu côté serveur (SSR)

En SSR, la page est générée **à chaque requête**. Cela garantit que les données sont toujours fraîches, mais c'est plus lent que le rendu statique.

Pour forcer le rendu dynamique, utilisez `export const dynamic = "force-dynamic"` ou accédez à des données de la requête comme les cookies ou les en-têtes :

``` ts title="app/profil/page.tsx (SSR)"
import { cookies } from "next/headers";

export default async function ProfilPage() {
  // L'accès aux cookies force automatiquement le rendu dynamique
  const cookieStore = await cookies();
  const utilisateurId = cookieStore.get("utilisateur_id")?.value;

  const response = await fetch(`https://api.exemple.com/utilisateurs/${utilisateurId}`, {
    cache: "no-store", // Désactive le cache pour toujours obtenir des données fraîches
  });
  const utilisateur = await response.json();

  return (
    <main>
      <h1>Profil de {utilisateur.nom}</h1>
    </main>
  );
}
```

Fonctions qui déclenchent automatiquement le rendu dynamique :

| Fonction | Provenance |
|---|---|
| `cookies()` | `next/headers` |
| `headers()` | `next/headers` |
| `searchParams` | Props de la page |
| `fetch` avec `cache: "no-store"` | API Web standard |

!!! tip "Avantage"
    Le SSR est idéal pour les pages personnalisées selon l'utilisateur connecté : tableau de bord, panier d'achats, fil de notifications.

## Rendu côté client (CSR)

Le rendu côté client (CSR) produit le HTML **dans le navigateur** avec JavaScript. En Next.js, on l'obtient avec les **Client Components** (`"use client"`).

``` ts title="app/compteur/page.tsx (CSR)"
"use client";

import { useState } from "react";

export default function CompteurPage() {
  const [compte, setCompte] = useState(0);

  return (
    <main>
      <h1>Compteur : {compte}</h1>
      <button onClick={() => setCompte(compte + 1)}>Incrémenter</button>
    </main>
  );
}
```

!!! warning "Inconvénient SEO"
    Le contenu rendu côté client n'est pas visible par les moteurs de recherche lors de leur première visite, car le HTML initial est vide. Préférez le CSR uniquement pour les parties interactives d'une page.

## Choisir le bon mode

``` mermaid
graph TD
    A[La page a-t-elle besoin d'interactivité ?] -->|Oui| B[Client Component]
    A -->|Non| C[Server Component]
    C --> D[Les données changent-elles souvent ?]
    D -->|Jamais ou rarement| E[Rendu statique SSG]
    D -->|Périodiquement| F[ISR avec revalidate]
    D -->|À chaque requête ou par utilisateur| G[Rendu dynamique SSR]
```

| Cas d'usage | Mode recommandé |
|---|---|
| Page de présentation, FAQ | SSG |
| Catalogue de produits mis à jour quotidiennement | ISR |
| Page de profil personnalisée | SSR |
| Composant avec boutons, formulaires interactifs | CSR (Client Component) |
| Tableau de bord avec données en temps réel | SSR + CSR |

## Vérifier le mode de rendu

Lors du build (`npm run build`), Next.js affiche le mode de rendu de chaque route :

``` nodejsrepl title="console"
Route (app)                    Size     First Load JS
┌ ○ /                          142 B          87.2 kB
├ ○ /a-propos                  142 B          87.2 kB
├ ƒ /profil                    142 B          87.2 kB
└ ● /produits                  142 B          87.2 kB
    └ /produits/[id]

○  (Static)   prérendu en HTML statique
●  (SSG)      prérendu en HTML statique avec données
ƒ  (Dynamic)  rendu côté serveur à la demande
```

!!! manuel
    [Rendering - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/rendering)
