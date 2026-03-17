# Prisma ORM

## Qu'est-ce qu'un ORM

Un **ORM** (Object-Relational Mapping) est un outil qui permet de manipuler une base de données relationnelle en utilisant des objets dans votre code, plutôt que d'écrire des requêtes SQL manuellement.

| Sans ORM (SQL brut) | Avec ORM (Prisma) |
|---|---|
| `SELECT * FROM produit WHERE id = 1` | `prisma.produit.findUnique({ where: { id: 1 } })` |
| `INSERT INTO produit (nom, prix) VALUES ('Clavier', 129.99)` | `prisma.produit.create({ data: { nom: 'Clavier', prix: 129.99 } })` |

**Prisma** est l'ORM recommandé pour les projets Next.js. Il supporte MySQL, PostgreSQL, SQLite et d'autres bases de données.

!!! manuel
    [Documentation officielle Prisma](https://www.prisma.io/docs)

## Installation et configuration

### Installer Prisma

``` nodejsrepl title="console"
npm install prisma --save-dev
npm install @prisma/client
```

### Initialiser Prisma avec MySQL

``` nodejsrepl title="console"
npx prisma init --datasource-provider mysql
```

Cette commande crée :

- Un dossier `prisma/` avec un fichier `schema.prisma`
- Un fichier `.env` avec la variable `DATABASE_URL`

### Configurer la connexion à la base de données

Modifiez le fichier `.env` avec vos informations de connexion MySQL :

``` title=".env"
DATABASE_URL="mysql://utilisateur:motdepasse@localhost:3306/nom_de_la_bd"
```

## Schéma Prisma

Le fichier `schema.prisma` est le coeur de Prisma. Il définit la structure de votre base de données.

``` prisma title="prisma/schema.prisma"
{!next-prisma/prisma/schema.prisma!}
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

### Relations

Dans l'exemple ci-dessus, un `Produit` appartient à une `Categorie`, et une `Categorie` peut avoir plusieurs `Produit`. C'est une relation **un-à-plusieurs**.

- `@relation(fields: [categorieId], references: [id])` : indique que `categorieId` est la clé étrangère qui pointe vers `id` de `Categorie`.
- `produits Produit[]` : côté inverse de la relation, une catégorie contient un tableau de produits.

## Migrations

Les migrations permettent de synchroniser votre schéma Prisma avec la base de données.

### Créer et appliquer une migration

``` nodejsrepl title="console"
npx prisma migrate dev --name init
```

Cette commande :

1. Compare le schéma Prisma avec l'état actuel de la base de données
2. Génère un fichier SQL de migration
3. Exécute la migration sur la base de données
4. Régénère le Prisma Client

### Réinitialiser la base de données

Pour repartir à zéro (supprime toutes les données) :

``` nodejsrepl title="console"
npx prisma migrate reset
```

## Prisma Client

Le Prisma Client est l'objet qui permet d'effectuer des opérations sur la base de données.

### Configuration du client

Dans un projet Next.js, il est important de créer une instance unique de Prisma Client pour éviter les problèmes de connexion en développement :

``` ts title="lib/prisma.ts"
{!next-prisma/lib/prisma.ts!}
```

### Opérations CRUD

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

## Prisma Studio

Prisma Studio est une interface graphique pour visualiser et modifier les données de votre base de données :

``` nodejsrepl title="console"
npx prisma studio
```

Cela ouvre un navigateur web à l'adresse `http://localhost:5555` avec une interface permettant de consulter, ajouter, modifier et supprimer des enregistrements.

## Seed de données

Le seeding permet d'insérer des données initiales dans la base de données, utile pour le développement et les tests.

### Créer le fichier de seed

``` ts title="prisma/seed.ts"
{!next-prisma/prisma/seed.ts!}
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
