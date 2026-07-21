# Server Actions et formulaires

## Qu'est-ce qu'une Server Action

En React pur, pour interagir avec une base de données (ex: un formulaire pour l'ajout d'un produit), il faut appeler un API (souvent en Express ou PHP). Les actions serveurs élimine le besoin d'un API distinct en permettant l'appel de fonctions asynchrone entre la portion client et serveur de votre application.  

!!! manuel
    [Server Actions - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## "use server"

Une action serveur doit avoir `"use server"` au début du fichier :

``` ts title="app/actions/produit.actions.ts"
--8<-- "next-prisma/app/actions/produit.actions.ts"
```

## Formulaires avec Server Actions

On peut utiliser une actions serveur directement dans l'attribut `action` d'un formulaire HTML :

``` ts title="app/produits/nouveau/page.tsx"
--8<-- "next-prisma/app/produits/nouveau/page.tsx"
```

Lorsque le formulaire est soumis, la fonction `creerProduit` est appelée sur le serveur avec les données du formulaire en `FormData`.

## Utiliser une Server Action avec bind

Si vous avez des variables à passer à l'action serveur sans l'ajouter comme champ du formulaire, il faut utiliser `.bind()` :

``` ts title="app/produits/page.tsx"
--8<-- "next-prisma/app/produits/page.tsx"
```

## Validation de formulaires

Même si la validation est faite du côté client, pour des raisons de sécurité et d'intégrité il faut valider toutes les données du formulaire dans l'action serveur. 

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

Après un changement dans les données (création, modification, suppression), il faut dire à Next.js de rafraîchir les données affichées en utilisant `revalidatePath` :

``` ts title="Revalidation"
import { revalidatePath } from "next/cache";

// Revalider une page spécifique
revalidatePath("/produits");

// Revalider toutes les pages
revalidatePath("/", "layout");
```

Sans `revalidatePath`, les pages afficheront les données en cache sans les dernières modifications...
