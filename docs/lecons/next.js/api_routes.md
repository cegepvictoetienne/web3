# API Routes (Route Handlers)

## Qu'est-ce qu'une Route API

Les Route Handlers de Next.js permettent de créer des **points d'accès API** directement dans votre application. Pas besoin d'un serveur backend séparé.

Les routes API sont définies dans des fichiers `route.ts` à l'intérieur du dossier `app/api/`.

```
app/
└── api/
    └── produits/
        ├── route.ts          → /api/produits (GET, POST)
        └── [id]/
            └── route.ts      → /api/produits/1 (GET, PUT, DELETE)
```

!!! manuel
    [Route Handlers - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Méthodes HTTP

Chaque fichier `route.ts` peut exporter des fonctions nommées selon la méthode HTTP : `GET`, `POST`, `PUT`, `DELETE`, etc.

### GET et POST

``` ts title="app/api/produits/route.ts"
{!next-prisma/app/api/produits/route.ts!}
```

### GET, PUT et DELETE avec paramètre dynamique

``` ts title="app/api/produits/[id]/route.ts"
{!next-prisma/app/api/produits/[id]/route.ts!}
```

## Tester les routes API

Vous pouvez tester vos routes API avec un outil comme **Thunder Client** (extension VS Code) ou directement dans le navigateur pour les requêtes GET.

### Exemple de requête GET

``` nodejsrepl title="console"
curl http://localhost:3000/api/produits
```

### Exemple de requête POST

``` nodejsrepl title="console"
curl -X POST http://localhost:3000/api/produits \
  -H "Content-Type: application/json" \
  -d '{"nom": "Casque audio", "prix": 199.99, "categorieId": 1}'
```

## Validation des données

Il est important de valider les données reçues avant de les traiter. Dans l'exemple ci-dessus, nous vérifions que les champs obligatoires sont présents :

``` ts title="Validation simple"
if (!body.nom || !body.prix || !body.categorieId) {
  return NextResponse.json(
    { erreur: "Les champs nom, prix et categorieId sont requis." },
    { status: 400 }
  );
}
```

Pour des validations plus avancées, vous pouvez utiliser une bibliothèque comme **Zod** :

``` ts title="Validation avec Zod"
import { z } from "zod";

const schemaProduit = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  prix: z.number().positive("Le prix doit être positif"),
  categorieId: z.number().int("L'ID de catégorie doit être un entier"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const resultat = schemaProduit.safeParse(body);

  if (!resultat.success) {
    return NextResponse.json(
      { erreurs: resultat.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Les données sont validées, on peut les utiliser en toute sécurité
  const produit = await prisma.produit.create({
    data: resultat.data,
  });

  return NextResponse.json(produit, { status: 201 });
}
```

## Réponses JSON

La classe `NextResponse` fournit des méthodes utilitaires pour créer des réponses HTTP :

``` ts title="Différents types de réponses"
import { NextResponse } from "next/server";

// Réponse avec données (200 par défaut)
return NextResponse.json({ nom: "Clavier" });

// Réponse avec code de statut personnalisé
return NextResponse.json(produit, { status: 201 });

// Réponse d'erreur
return NextResponse.json({ erreur: "Non trouvé" }, { status: 404 });
```
