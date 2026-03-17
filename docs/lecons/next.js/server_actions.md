# Server Actions et formulaires

## Qu'est-ce qu'une Server Action

Les Server Actions sont des fonctions asynchrones qui s'exécutent **sur le serveur** et peuvent être appelées directement depuis vos composants. Elles permettent de gérer les soumissions de formulaires et les mutations de données sans créer de route API.

!!! manuel
    [Server Actions - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## La directive "use server"

Pour déclarer une Server Action, ajoutez la directive `"use server"` au début du fichier :

``` ts title="app/actions/produit.actions.ts"
{!next-prisma/app/actions/produit.actions.ts!}
```

Points importants :

- `"use server"` indique que toutes les fonctions exportées de ce fichier sont des Server Actions.
- Ces fonctions s'exécutent **uniquement sur le serveur**, jamais dans le navigateur.
- `revalidatePath` permet de rafraîchir les données affichées sur une page après une modification.

## Formulaires avec Server Actions

Les Server Actions peuvent être utilisées directement dans l'attribut `action` d'un formulaire HTML :

``` ts title="app/produits/nouveau/page.tsx"
{!next-prisma/app/produits/nouveau/page.tsx!}
```

Lorsque le formulaire est soumis, la fonction `creerProduit` est appelée sur le serveur avec les données du formulaire sous forme de `FormData`.

## Utiliser une Server Action avec bind

Pour passer des arguments supplémentaires à une Server Action (comme un ID), utilisez `.bind()` :

``` ts title="app/produits/page.tsx"
{!next-prisma/app/produits/page.tsx!}
```

Dans cet exemple, `supprimerProduit.bind(null, produit.id)` crée une nouvelle fonction qui appellera `supprimerProduit` avec l'ID du produit en premier argument.

## Validation de formulaires

Il est important de valider les données côté serveur dans vos Server Actions. Voici un exemple avec validation et retour d'erreurs :

``` ts title="Validation dans une Server Action"
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ResultatAction {
  erreur?: string;
  succes?: boolean;
}

export async function creerProduit(
  etatPrecedent: ResultatAction,
  formData: FormData
): Promise<ResultatAction> {
  const nom = formData.get("nom") as string;
  const prix = parseFloat(formData.get("prix") as string);

  // Validation
  if (!nom || nom.trim().length === 0) {
    return { erreur: "Le nom est requis." };
  }

  if (isNaN(prix) || prix <= 0) {
    return { erreur: "Le prix doit être un nombre positif." };
  }

  await prisma.produit.create({
    data: { nom, prix, categorieId: 1 },
  });

  revalidatePath("/produits");
  return { succes: true };
}
```

Pour utiliser cette version avec validation, le formulaire doit être un Client Component utilisant le hook `useActionState` :

``` ts title="Formulaire avec validation (Client Component)"
"use client";

import { useActionState } from "react";
import { creerProduit } from "@/app/actions/produit.actions";

export default function FormulaireProduit() {
  const [etat, action, enAttente] = useActionState(creerProduit, {});

  return (
    <form action={action}>
      <div>
        <label htmlFor="nom">Nom :</label>
        <input type="text" id="nom" name="nom" required />
      </div>

      <div>
        <label htmlFor="prix">Prix :</label>
        <input type="number" id="prix" name="prix" step="0.01" required />
      </div>

      {etat.erreur && <p style={{ color: "red" }}>{etat.erreur}</p>}
      {etat.succes && <p style={{ color: "green" }}>Produit ajouté!</p>}

      <button type="submit" disabled={enAttente}>
        {enAttente ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  );
}
```

## Revalidation des données

Après une mutation (création, modification, suppression), il faut indiquer à Next.js de rafraîchir les données affichées. La fonction `revalidatePath` permet de revalider les données associées à un chemin :

``` ts title="Revalidation"
import { revalidatePath } from "next/cache";

// Revalider une page spécifique
revalidatePath("/produits");

// Revalider toutes les pages
revalidatePath("/", "layout");
```

Sans revalidation, les pages afficheront les données en cache et ne refléteront pas les modifications effectuées par la Server Action.
