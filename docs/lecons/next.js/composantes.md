# Server Components et Client Components

## Deux types de composants

Dans Next.js, il existe deux types de composants :

- **Server Components** : exécutés sur le serveur seulement (par défaut)
- **Client Components** : exécutés dans le navigateur  

Par défaut, tous les composants dans Next.js sont des **Server Components**.

## Server Components

Pourquoi utiliser des composantes serveur? Voici quelques besoins comblés :  

Si vous voules accéder à la base de données, lire des fichiers sur le serveur, garder les clés secrètes (comme celles utilisées dans les appels API) sur le serveur, il faut utiliser les composants serveur. 

``` ts title="app/produits/page.tsx (Server Component)"
import { prisma } from "@/lib/prisma";

export default async function ProduitsPage() {
  // Cette requête s'exécute sur le serveur seulement
  const produits = await prisma.produit.findMany();

  return (
    <main>
      <h1>Produits</h1>
      <ul>
        {produits.map((produit) => (
          <li key={produit.id}>{produit.nom} - {produit.prix} $</li>
        ))}
      </ul>
    </main>
  );
}
```


## Client Components

Les composantes client roulent dans le navigateur. Nécessaires si on veut utiliser les hooks React, gérer des événements ou utiliser des API du navigateur (témoins et autres...)

Pour indiquer à Next.JS que le composant est client, mettre `"use client"` au début du fichier :

``` ts title="app/produits/compteur.tsx"
--8<-- "next-routage/app/produits/compteur.tsx"
```

## Composition : Server et Client ensemble

Les composants serveurs et clients peuvent être utilisées en même temps dans une page. Le truc est d'isoler la partie interactive de la page dans un composant client et d'instancier ce dernier dans la page serveur.

``` ts title="app/produits/page.tsx (Server Component parent)"
import { prisma } from "@/lib/prisma";
import ListeProduits from "./liste-produits";

export default async function ProduitsPage() {
  const produits = await prisma.produit.findMany();

  // Les données sont passées en props au Client Component
  return <ListeProduits produits={produits} />;
}
```

``` ts title="app/produits/liste-produits.tsx (Client Component enfant)"
"use client";

import { useState } from "react";

interface Produit {
  id: number;
  nom: string;
  prix: number;
}

export default function ListeProduits({ produits }: { produits: Produit[] }) {
  const [recherche, setRecherche] = useState("");

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />
      <ul>
        {produitsFiltres.map((produit) => (
          <li key={produit.id}>{produit.nom} - {produit.prix} $</li>
        ))}
      </ul>
    </div>
  );
}
```

!!! manuel
    [Server Components - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
