# Modes de rendu dans Next.js

## Vue d'ensemble

L'optimisation de votre application Web se doit de passer par les bons modes de rendus de Next.JS. Certains modes génèrent le HTML du côté serveur, certains du côté client. Certains sont générés statiquement, d'autres sont dynamiques.

## Rendu statique (SSG)

Si vous ne faîtes aucune configuration spéciale, Next.js génère les pages statiquement lors de la compilation (`npm run build`). Le HTML est produit une seule fois et servi sans être regénéré lors de l'appel. C'est le mode le plus rapide.

``` ts title="app/a-propos/page.tsx"
export default function AProposPage() {
  return (
    <main>
      <h1>À propos</h1>
      <p>Cette page est générée une seule fois au moment de la compilation.</p>
    </main>
  );
}
```

Sans données dynamiques, Next.js l'optimise automatiquement en rendu statique.

Le rendu statique est idéal pour les pages dont le contenu change rarement :   

-  pages de présentation  
-  documentation  
-  articles de blogue  



## Rendu statique avec données (SSG avec fetch)

Une page statique avec des données lues d'un API (fetch) peut être généré statiquement au moment de la compilation. La page est quand même générée une seule fois, mais avec des données réelles.

``` ts title="app/produits/page.tsx"
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

## Rendu statique incrémentiel (ISR)

Si la page générée avec des données lors de la compilation doit être regénérée périodiquement, il faut utiliser le rendu statique incrémental.

``` ts title="app/produits/page.tsx"
import { cacheLife } from 'next/cache'
import { Suspense } from 'react';


export  async function Temperature() {
    'use cache'
    cacheLife({ revalidate: 60, expire: Infinity })

    type imeteo = {
        current_weather: 
        {
            temperature: number,
            windspeed: number
        },
        nom: string,
    }
    const results =  await fetch('https://api.open-meteo.com/v1/forecast?latitude=46.05&longitude=-71.96&current_weather=true');
    console.log(results);
    const meteo: imeteo =  await results.json();


    return (
        <div>
            température : {meteo.current_weather.temperature}
        </div>
    )
} 

export default async function MeteoPage() {
    
    return (
        <Suspense>
            <Temperature/>
        </Suspense>
    )

    
}
```

Utile pour :  
- catalogue de produits  
- fil d'actualités
- classements

## Rendu côté serveur (SSR)

Si la fraîcheur des données est essentielle, il faut s'assurer que la page soit générée à chaque appel. C'est le SSR.

Il faut utiliser `export const dynamic = "force-dynamic"` ou accédez à des données de la requête comme les témoins ou les en-têtes :

``` ts title="app/profil/page.tsx"

import { Suspense } from 'react';


export  async function Temperature() {

    type imeteo = {
        current_weather: 
        {
            temperature: number,
            windspeed: number
        },
        nom: string,
    }
    const results =  await fetch('https://api.open-meteo.com/v1/forecast?latitude=46.05&longitude=-71.96&current_weather=true',  {
    cache: "no-store", // Désactive le cache pour toujours obtenir des données fraîches
  });
    console.log(results);
    const meteo: imeteo =  await results.json();


    return (
        <div>
            température : {meteo.current_weather.temperature}
        </div>
    )
} 

export default async function MeteoPage() {
    
    return (
        <Suspense>
            <Temperature/>
        </Suspense>
    )
    
}
```

Utile pour :  

- tableau de bord  
- panier d'achats  
- fil de notifications  

## Rendu côté client (CSR)

Générer le HTML du côté client est ce que fait React par défaut sans Next.Js. Pour reproduire ce fonctionnement avec Next.Js, il faut spécifier les **Client Components** (`"use client"`).

``` ts title="app/compteur/page.tsx"
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
- Tout besoin d'interactivité de la page (boutons, menus, etc.)  

## Vérifier le mode de rendu

Lors de la compilation (`npm run build`), Next.js affiche le mode de rendu de chaque route :

``` nodejsrepl title="console"
Route (app)      Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /a-propos
├ ƒ /profil
└ ○ /produits           60s      1y
└ ◐ /meteo


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

!!! manuel
    [Rendering - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/rendering)
