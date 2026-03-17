# Introduction à Next.js

## Qu'est-ce que Next.js

Next.js est un framework basé sur React qui permet de créer des applications web complètes. Contrairement à React seul (qui génère une application monopage, ou SPA), Next.js offre le **rendu côté serveur** (SSR), la **génération statique** (SSG), le routage basé sur les fichiers et bien plus.

### Pourquoi utiliser Next.js plutôt que React seul?

| Caractéristique | React (Vite) | Next.js |
|---|---|---|
| Rendu | Côté client seulement (SPA) | Côté serveur et client |
| HTML initial | Un seul `&lt;div id="root"&gt;` vide | HTML complet généré par le serveur |
| Routage | Bibliothèque externe (React Router) | Intégré (basé sur les fichiers) |
| API Backend | Serveur séparé requis | Route Handlers intégrés |
| SEO | Difficile (contenu généré par JavaScript) | Excellent (HTML pré-rendu) |

### Différence dans le HTML généré

Avec React (Vite), le navigateur reçoit un HTML presque vide. Tout le contenu est généré par JavaScript côté client :

``` html title="index.html (React avec Vite)"
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

Avec Next.js, le serveur génère le HTML complet avant de l'envoyer au navigateur :

``` html title="HTML généré par Next.js"
<body>
  <main>
    <h1>Bienvenue sur mon application Next.js</h1>
    <p>Ceci est la page d'accueil.</p>
  </main>
  <script src="/_next/static/chunks/main.js"></script>
</body>
```

!!! manuel
    [Documentation officielle Next.js](https://nextjs.org/docs)

## Création d'un projet

Pour créer un nouveau projet Next.js, exécutez la commande suivante :

``` nodejsrepl title="console"
npx create-next-app@latest
```

L'outil vous posera quelques questions. Choisissez les options recommandées par défaut :

``` nodejsrepl title="console"
? Would you like to use the recommended Next.js defaults? › - Use arrow-keys. Return to submit.
❯   Yes, use recommended defaults
    TypeScript, ESLint, Tailwind CSS, App Router
    No, reuse previous settings
    No, customize settings
```

Cela crée la page suivante :

<figure markdown>
  ![Page par défaut](images/page-defaut.png){ width="600" }
  <figcaption>Page par défaut d'une application Next.js</figcaption>
</figure>

## Structure du projet

Voici la structure d'un projet Next.js fraîchement créé :

```
mon-projet/
├── app/                  # Dossier principal de l'application
│   ├── layout.tsx        # Layout racine (gabarit principal)
│   ├── page.tsx          # Page d'accueil (route /)
│   ├── globals.css       # Styles CSS globaux
│   └── favicon.ico       # Icône du site
├── public/               # Fichiers statiques (images, etc.)
├── next.config.ts        # Configuration de Next.js
├── tsconfig.json         # Configuration TypeScript
├── package.json          # Dépendances et scripts
└── eslint.config.mjs     # Configuration ESLint
```

## Les fichiers importants

### layout.tsx - Le gabarit racine

Le fichier `layout.tsx` est le gabarit principal de l'application. Il enveloppe toutes les pages et contient la structure HTML de base (`&lt;html&gt;` et `&lt;body&gt;`).

``` ts title="app/layout.tsx"
{!next-intro/app/layout.tsx!}
```

Points importants :

- L'objet `metadata` permet de définir le titre et la description de la page (balises `&lt;title&gt;` et `&lt;meta&gt;`).
- La propriété `children` représente le contenu de la page active.
- Ce layout s'applique à **toutes les pages** de l'application.

### page.tsx - La page d'accueil

Le fichier `page.tsx` à la racine du dossier `app/` correspond à la route `/` (page d'accueil).

``` ts title="app/page.tsx"
{!next-intro/app/page.tsx!}
```

### next.config.ts - La configuration

Le fichier `next.config.ts` permet de personnaliser le comportement de Next.js :

``` ts title="next.config.ts"
{!next-intro/next.config.ts!}
```

## Les métadonnées

Next.js permet de définir les métadonnées de chaque page (titre, description, etc.) en exportant un objet `metadata` :

``` ts title="Exemple de métadonnées"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon application Next.js",
  description: "Ma première application Next.js",
};
```

Ces métadonnées sont automatiquement ajoutées aux balises `&lt;head&gt;` du HTML généré. Chaque page peut définir ses propres métadonnées qui remplaceront celles du layout parent.

!!! manuel
    [Metadata - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## Lancer le serveur de développement

Pour démarrer le serveur de développement :

``` nodejsrepl title="console"
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:3000`.

Les modifications apportées aux fichiers seront automatiquement reflétées dans le navigateur grâce au **rechargement à chaud** (Hot Module Replacement).
