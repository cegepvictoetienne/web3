# Modes de rendu dans Next.js

## Vue d'ensemble

Le choix du mode de rendu détermine **quand** le HTML d'une page est produit et **qui** peut réutiliser le résultat. C'est l'un des leviers les plus importants pour optimiser votre application Web.

Pour chaque morceau d'interface, posez-vous la question suivante : *quand ce HTML est-il généré, et est-ce que tous les utilisateurs peuvent le partager ?*

| Mode | Quand le HTML est-il généré ? | Partagé entre utilisateurs ? |
|------|-------------------------------|------------------------------|
| Statique (SSG) | À la compilation | Oui |
| Statique incrémentiel (ISR) | À la compilation, puis périodiquement | Oui |
| Côté serveur (SSR) | À chaque requête | Non |
| Prérendu partiel (PPR) | Coquille à la compilation, reste à la requête | En partie |
| Côté client (CSR) | Dans le navigateur | Non |

!!! note "Next.js 16 et Cache Components"
    Depuis Next.js 16, le modèle de rendu repose sur les **Cache Components**. Les données sont **dynamiques par défaut** et c'est vous qui choisissez ce qui est mis en cache avec la directive `'use cache'`. Il faut activer l'option dans la configuration :

    next.config.ts

    ```ts
    import type { NextConfig } from 'next'

    const nextConfig: NextConfig = {
      cacheComponents: true,
    }

    export default nextConfig
    ```

    Les leçons plus anciennes utilisent `getStaticProps`, `getServerSideProps` ou `export const revalidate`. Ces approches ne s'appliquent pas à ce modèle.

## Rendu statique (SSG)

Un composant qui n'utilise ni données externes ni données de la requête est généré **une seule fois** lors de la compilation (`npm run build`). Le HTML est ensuite servi tel quel, sans être regénéré. C'est le mode le plus rapide.

app/a-propos/page.tsx

```tsx
export default function AProposPage() {
  return (
    <main>
      <h1>À propos</h1>
      <p>Cette page est générée une seule fois au moment de la compilation.</p>
    </main>
  );
}
```

Les calculs purs, les imports de modules et les entrées/sorties synchrones peuvent se terminer pendant la compilation. Next.js les inclut donc automatiquement dans le HTML statique.

Le rendu statique est idéal pour les pages dont le contenu change rarement :

- pages de présentation
- documentation
- articles de blogue

## Rendu statique avec données (SSG avec fetch)

Un fetch est une opération **asynchrone** : Next.js ne peut pas la terminer seul pendant la compilation. Pour que la page soit tout de même générée une fois pour toutes avec des données réelles, il faut le demander explicitement avec `'use cache'`.

app/produits/page.tsx

```tsx
import { cacheLife } from 'next/cache'

export default async function ProduitsPage() {
  'use cache'
  cacheLife({ revalidate: Infinity, expire: Infinity })

  // Ce fetch s'exécute une seule fois, au moment de la compilation
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

!!! warning "Sans `'use cache'`"
    Si vous retirez `'use cache'`, le fetch devient une opération dynamique. Next.js refusera de compiler tant que vous n'aurez pas décidé quoi faire : mettre le résultat en cache ou envelopper le composant dans `<Suspense>`.

## Rendu statique incrémentiel (ISR)

Si la page générée avec des données doit être **regénérée périodiquement**, on ajoute une durée de revalidation avec `cacheLife`.

app/meteo/page.tsx

```tsx
import { cacheLife } from 'next/cache'
import { Suspense } from 'react';

type Meteo = {
  current_weather: {
    temperature: number;
    windspeed: number;
  };
};

async function Temperature() {
  'use cache'
  cacheLife({ revalidate: 60, expire: 3600 })

  const response = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=46.05&longitude=-71.96&current_weather=true'
  );
  const meteo: Meteo = await response.json();

  return <p>Température : {meteo.current_weather.temperature} °C</p>;
}

export default function MeteoPage() {
  return (
    <main>
      <h1>Météo</h1>
      <Suspense fallback={<p>Chargement...</p>}>
        <Temperature />
      </Suspense>
    </main>
  );
}
```

Les deux paramètres de `cacheLife` :

- `revalidate` : après ce nombre de secondes, la prochaine requête déclenche une regénération en arrière-plan
- `expire` : après ce nombre de secondes sans visite, le cache est considéré comme périmé

Utile pour :

- catalogue de produits
- fil d'actualités
- classements (leaderboard)

### Revalider à la demande

Attendre une minute n'est pas toujours acceptable : quand un administrateur modifie un produit, la page doit être à jour tout de suite. On associe alors une **étiquette** au cache avec `cacheTag`, puis on l'invalide quand les données changent.

app/produits/page.tsx

```tsx
import { cacheLife, cacheTag } from 'next/cache'

async function ListeProduits() {
  'use cache'
  cacheLife('hours')
  cacheTag('produits')

  const response = await fetch("https://api.exemple.com/produits");
  const produits = await response.json();

  return (
    <ul>
      {produits.map((p: { id: number; nom: string }) => (
        <li key={p.id}>{p.nom}</li>
      ))}
    </ul>
  );
}
```

app/admin/actions.ts

```ts
'use server'

import { revalidateTag } from 'next/cache'

export async function ajouterProduit(formData: FormData) {
  // ... enregistrer le produit dans la base de données ...

  // Invalide tous les caches portant l'étiquette « produits »
  revalidateTag('produits', 'max')
}
```

## Rendu côté serveur (SSR)

Si la fraîcheur ou la personnalisation des données est essentielle, il faut que le composant soit rendu **à chaque requête**. C'est le SSR.

Avec les Cache Components, il suffit de **ne pas mettre en cache** et d'accéder à une donnée de la requête (comme `cookies()`) ou d'appeler `connection()`. Le composant doit être enveloppé dans `<Suspense>`.

app/profil/page.tsx

```tsx
import { cookies } from 'next/headers';
import { Suspense } from 'react';

async function NomUtilisateur() {
  // Lire les cookies rend ce composant dynamique : il est rendu à chaque requête
  const cookieStore = await cookies();
  const nom = cookieStore.get('nom')?.value ?? 'invité';

  return <p>Bonjour, {nom}</p>;
}

export default function ProfilPage() {
  return (
    <main>
      <h1>Profil</h1>
      <Suspense fallback={<p>Chargement...</p>}>
        <NomUtilisateur />
      </Suspense>
    </main>
  );
}
```

Pour obtenir des données fraîches sans lire de cookies, on utilise `connection()` :

```tsx
import { connection } from 'next/server';

async function Heure() {
  await connection(); // Indique que le rendu doit avoir lieu à la requête
  return <p>{new Date().toLocaleTimeString()}</p>;
}
```

!!! note "Pourquoi `<Suspense>` ?"
    Pendant la compilation, Next.js ne peut pas terminer ce qui dépend de la requête. Si ce travail n'est pas dans une frontière `<Suspense>`, la compilation échoue avec une erreur au sujet de données non mises en cache lues hors d'une frontière `<Suspense>`. C'est voulu : Next.js vous force à décider de ce qui est statique et de ce qui est dynamique.

Utile pour :

- tableau de bord
- panier d'achats
- fil de notifications

## Streaming avec Suspense

Le composant `<Suspense>` ne sert pas qu'à éviter une erreur : il permet le **streaming**. Le serveur envoie d'abord le HTML qui est prêt, puis il envoie le reste au fur et à mesure que les données arrivent.

```tsx
<Suspense fallback={<p>Chargement des recommandations...</p>}>
  <Recommandations />
</Suspense>
```

L'utilisateur voit la page apparaître immédiatement, avec un contenu de remplacement (`fallback`) aux endroits qui attendent des données.

## Prérendu partiel (PPR)

Une même route peut combiner **les trois approches**. C'est le prérendu partiel (*Partial Prerendering*), le comportement par défaut avec les Cache Components :

- ce qui est statique est généré à la compilation et forme la **coquille** (*shell*) de la page
- ce qui est en cache est inclus dans la coquille et revalidé selon `cacheLife`
- ce qui est dynamique est envoyé en streaming à chaque requête

Exemple : une page de produit.

app/produits/\[id\]/page.tsx

```tsx
import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';

async function Details({ id }: { id: string }) {
  'use cache'
  cacheLife('hours')
  cacheTag(`produit-${id}`)

  const response = await fetch(`https://api.exemple.com/produits/${id}`);
  const produit = await response.json();

  return (
    <section>
      <h2>{produit.nom}</h2>
      <p>{produit.description}</p>
    </section>
  );
}

async function Panier() {
  const cookieStore = await cookies();
  const panier = cookieStore.get('panier')?.value ?? '0';
  return <p>Articles dans votre panier : {panier}</p>;
}

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <nav>Boutique</nav> {/* statique */}

      <Suspense fallback={<p>Chargement du produit...</p>}>
        <Details id={id} /> {/* en cache */}
      </Suspense>

      <Suspense fallback={<p>Chargement du panier...</p>}>
        <Panier /> {/* dynamique */}
      </Suspense>
    </main>
  );
}
```

Le navigateur reçoit la barre de navigation et les détails du produit immédiatement depuis la coquille, puis le panier personnalisé arrive en streaming.

## Rendu côté client (CSR)

Générer le HTML du côté client est ce que fait React par défaut sans Next.js. Pour obtenir ce fonctionnement dans Next.js, il faut déclarer des **Client Components** (`"use client"`).

app/compteur/page.tsx

```tsx
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

Utile pour :

- tout besoin d'interactivité de la page (boutons, menus, formulaires)
- l'utilisation de `useState`, `useEffect` ou des API du navigateur

!!! note
    Un Client Component est quand même prérendu sur le serveur pour son HTML initial. Il est ensuite *hydraté* dans le navigateur pour devenir interactif (voir la leçon sur l'hydratation).

## Choisir le bon mode

Pour chaque morceau d'interface, répondez dans l'ordre :

1. Le contenu est-il identique pour tous et change-t-il rarement ? **Statique**
2. Le contenu est-il identique pour tous mais change-t-il avec le temps ? **Cache avec `cacheLife`** (ISR), avec `cacheTag` si une invalidation immédiate est nécessaire
3. Le contenu dépend-il de l'utilisateur ou de la requête ? **Dynamique** dans un `<Suspense>` (SSR)
4. Faut-il de l'interactivité ? **Client Component** (CSR)

## Vérifier le mode de rendu

Lors de la compilation (`npm run build`), Next.js affiche le mode de rendu de chaque route :

console

```
Route (app)              Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /a-propos
├ ○ /compteur
├ ◐ /meteo                   1m       1h
├ ◐ /produits/[id]
└ ◐ /profil


○  (Static)   prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

Pour observer le streaming, ouvrez les outils de développement du navigateur, ralentissez le réseau (*Slow 4G*) et rechargez la page : la coquille apparaît avant les parties dynamiques.

## Manuel

[Rendering - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/rendering)

[Cache Components - Documentation Next.js](https://nextjs.org/docs/app/getting-started/cache-components)
