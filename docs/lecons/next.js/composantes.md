# Server Components et Client Components

## Deux types de composants

Dans Next.js, il existe deux types de composants :

- **Server Components** : exécutés sur le serveur seulement (par défaut)
- **Client Components** : exécutés sur le client (navigateur)

Par défaut, tous les composants dans Next.js sont des **Server Components**.

## Server Components

Les Server Components s'exécutent uniquement sur le serveur. Ils permettent de :

- Accéder directement à la base de données
- Lire des fichiers sur le serveur
- Garder les clés secrètes sur le serveur
- Réduire la quantité de JavaScript envoyée au navigateur

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

Remarquez que le composant est une fonction `async`. Les Server Components peuvent être asynchrones, ce qui permet d'utiliser `await` directement dans le composant.

## Client Components

Les Client Components s'exécutent dans le navigateur. Ils sont nécessaires pour :

- Utiliser les hooks React (`useState`, `useEffect`, etc.)
- Gérer les événements utilisateur (`onClick`, `onChange`, etc.)
- Utiliser les API du navigateur (`localStorage`, `window`, etc.)

Pour déclarer un Client Component, ajoutez la directive `"use client"` au début du fichier :

``` ts title="app/produits/compteur.tsx"
{!next-routage/app/produits/compteur.tsx!}
```

## Quand utiliser l'un ou l'autre

| Besoin | Server Component | Client Component |
|---|---|---|
| Accéder à la base de données | :white_check_mark: | :x: |
| Garder des secrets (clés API) | :white_check_mark: | :x: |
| Réduire le JavaScript client | :white_check_mark: | :x: |
| Utiliser `useState`, `useEffect` | :x: | :white_check_mark: |
| Gérer des événements (`onClick`) | :x: | :white_check_mark: |
| Utiliser les API du navigateur | :x: | :white_check_mark: |

**Règle générale** : utilisez les Server Components par défaut. Ajoutez `"use client"` seulement lorsque vous avez besoin d'interactivité ou de hooks React.

## Composition : Server et Client ensemble

Un pattern courant est d'avoir un Server Component parent qui passe des données à un Client Component enfant :

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

Dans cet exemple, les données sont chargées sur le serveur (pas de requête API visible par le client), puis le Client Component ajoute l'interactivité (barre de recherche).

!!! manuel
    [Server Components - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
