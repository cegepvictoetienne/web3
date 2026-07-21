# Prisma ORM

## Qu'est-ce qu'un ORM

Un ORM (de l'anglais Object-Relational Mapping) sert à simplifier l'interface entre la BD et le code fonctionnel. Au lieu de faire des requêtes SQL directement dans le code (comme des prepare en PHP),  on va utiliser des fonctions typescript.


| Sans ORM (SQL brut) | Avec ORM (Prisma) |
|---|---|
| `SELECT * FROM produit WHERE id = 1` | `prisma.produit.findUnique({ where: { id: 1 } })` |
| `INSERT INTO produit (nom, prix) VALUES ('Clavier', 129.99)` | `prisma.produit.create({ data: { nom: 'Clavier', prix: 129.99 } })` |

Il existe plusieurs modules ORM, mais Prisma est largement utilisé. Dans le cours, nous l'utiliserons avec MySQL.

!!! manuel
    [Documentation officielle Prisma](https://www.prisma.io/docs)  
    [Démarrage rapide - MySQL](https://www.prisma.io/docs/prisma-orm/quickstart/mysql)  

## Installation et configuration

### Installer Prisma

``` nodejsrepl title="console"
npm install prisma --save-dev
npm install @prisma/client @prisma/adapter-mariadb
```

### Initialiser Prisma avec MySQL

``` nodejsrepl title="console"
npx prisma init --datasource-provider mysql
```

On se retrouve avec :

- Un dossier `prisma/` contenant un fichier `schema.prisma`
- Un fichier `.env` avec la variable `DATABASE_URL`

### Configurer la connexion à la base de données

Modifiez le fichier `.env` avec vos informations de connexion MySQL :

``` title=".env"
DATABASE_URL="mysql://utilisateur:motdepasse@localhost:3306/nom_de_la_bd"
DATABASE_HOST="localhost"
DATABASE_USER="utilisteur"
DATABASE_PASSWORD="motdepasse"
DATABASE_NAME="nom_de_la_bd"
```

## Schéma Prisma

Un des fichiers importants pour bien utiliser l'ORM est `schema.prisma` : c'est là qu'on décrit la BD.

``` prisma title="prisma/schema.prisma"
--8<-- "next-prisma/prisma/schema.prisma"
```

Écrire ce fichier peut être difficile pour un débutant, le truc est de faire sa BD en SQL et extraire la BD dans Prisma :

``` nodejsrepl title="console"
npx prisma db pull
```

### Types de données courants

| Type Prisma | Type MySQL | Description |
|---|---|---|
| `String` | `VARCHAR(191)` | Texte |
| `Int` | `INT` | Nombre entier |
| `Float` | `DOUBLE` | Nombre décimal |
| `Boolean` | `TINYINT(1)` | Vrai ou faux |
| `DateTime` | `DATETIME` | Date et heure |

### Attributs courants

| Attribut | Description |
|---|---|
| `@id` | Clé primaire |
| `@default(autoincrement())` | Auto-incrémentation |
| `@default(now())` | Date actuelle par défaut |
| `@updatedAt` | Mis à jour automatiquement |
| `@unique` | Valeur unique |
| `?` après le type | Champ optionnel (nullable) |

## Migrations

Durant la vie de votre application, il est presque certain que la BD va être changée. C'est là que la puissance de Prisma joue un rôle critique. Si vous modifiez `schema.prisma`, vous pouvez automatiser la mise à jour de la BD avec les migrations.

### Créer et appliquer une migration

``` nodejsrepl title="console"
npx prisma migrate dev --name init
```

En arrière-plan, Prisma :

1. Compare le schéma avec l'état actuel de la base de données
2. Génère le fichier SQL correspondant à la différence
3. Exécute ce SQL sur la base de données
4. Régénère le Prisma Client pour que le code TypeScript reflète le nouveau schéma

### Réinitialiser la base de données

Pour avoir une BD vide, on peut faire une réinitialisation complète :

``` nodejsrepl title="console"
npx prisma migrate reset
```

## Prisma Client

Le schéma décrit la structure de la base de données, mais le client est l'interface de programmation à utiliser dans votre code. 
Pour générer le client, faire la commande suivante :

``` nodejsrepl title="console"
npx prisma generate
```

### Configuration du client

C'est recommandé de faire un singleton pour éviter les reconnections multiples lors du développement :

``` ts title="lib/prisma.ts"
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
```

### Opérations CRUD

Voici des exemples de CRUD pour `produit`.

#### Créer (Create)

``` ts title="Créer un enregistrement"
const produit = await prisma.produit.create({
  data: {
    nom: "Clavier mécanique",
    description: "Clavier RGB",
    prix: 129.99,
    categorieId: 1,
  },
});
```

#### Lire (Read)

``` ts title="Lire des enregistrements"
// Tous les produits
const produits = await prisma.produit.findMany();

// Un produit par son ID
const produit = await prisma.produit.findUnique({
  where: { id: 1 },
});

// Produits avec leur catégorie (jointure)
const produitsAvecCategorie = await prisma.produit.findMany({
  include: { categorie: true },
});

// Produits filtrés
const produitsElectroniques = await prisma.produit.findMany({
  where: { categorie: { nom: "Électronique" } },
});
```

#### Modifier (Update)

``` ts title="Modifier un enregistrement"
const produit = await prisma.produit.update({
  where: { id: 1 },
  data: { prix: 99.99 },
});
```

#### Supprimer (Delete)

``` ts title="Supprimer un enregistrement"
await prisma.produit.delete({
  where: { id: 1 },
});
```


## données de départ

Après un `migrate reset`, la base de données est vide. Utilisez des données de départ avec un `seed`.

### Créer le fichier de seed

``` ts title="prisma/seed.ts"
--8<-- "next-prisma/prisma/seed.ts"
```

### Configurer le script de seed

Ajoutez la configuration suivante dans votre `package.json` :

``` json title="package.json (extrait)"
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

### Exécuter le seed

``` nodejsrepl title="console"
npx prisma db seed
```

Le seed est aussi exécuté automatiquement lors d'un `npx prisma migrate reset`.
