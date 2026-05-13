# Routage dans Next.js

## Routage basé sur les fichiers

Dans Next.js, le routage est basé sur la structure des dossiers dans le répertoire `app/`. Chaque dossier correspond à un segment de l'URL, et un fichier `page.tsx` dans ce dossier rend la route accessible.

```
app/
├── page.tsx              → /
├── a-propos/
│   └── page.tsx          → /a-propos
└── produits/
    ├── page.tsx           → /produits
    └── [id]/
        └── page.tsx       → /produits/1, /produits/2, etc.
```

!!! manuel
    [Routing - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/routing)

## Les fichiers spéciaux

Next.js reconnaît plusieurs fichiers spéciaux dans chaque dossier de route :

| Fichier | Rôle |
|---|---|
| `page.tsx` | Le contenu de la page (rend la route accessible) |
| `layout.tsx` | Gabarit partagé qui enveloppe les pages enfants |
| `loading.tsx` | Interface de chargement affichée pendant le chargement |
| `error.tsx` | Interface d'erreur affichée en cas de problème |

### page.tsx

Fichier obligatoire pour qu'une route soit accessible. Il exporte le composant qui sera affiché :

``` ts title="app/page.tsx"
--8<-- "next-routage/app/page.tsx"
```

``` ts title="app/a-propos/page.tsx"
--8<-- "next-routage/app/a-propos/page.tsx"
```

### layout.tsx

Le layout enveloppe les pages enfants. Il est idéal pour les éléments de navigation partagés :

``` ts title="app/layout.tsx"
--8<-- "next-routage/app/layout.tsx"
```

Le composant `{children}` sera remplacé par le contenu de la page active. Ceci est similaire au concept de `&lt;Outlet /&gt;` dans React Router.

### loading.tsx

Affiche un indicateur de chargement pendant que la page se charge :

``` ts title="app/produits/loading.tsx"
--8<-- "next-routage/app/produits/loading.tsx"
```

### error.tsx

Gère les erreurs dans un segment de route. Ce fichier doit obligatoirement être un **Client Component** (`"use client"`) :

``` ts title="app/produits/error.tsx"
--8<-- "next-routage/app/produits/error.tsx"
```

## Routes dynamiques avec [parametre]

Pour créer une route dynamique, on utilise un nom de dossier entre crochets. Par exemple, `app/produits/[id]/page.tsx` accepte n'importe quelle valeur pour `id`.

``` ts title="app/produits/[id]/page.tsx"
--8<-- "next-routage/app/produits/[id]/page.tsx"
```

Le paramètre est accessible via la propriété `params` du composant. Dans Next.js 15+, `params` est une Promise qu'il faut attendre avec `await`.

## Navigation avec le composant Link

Pour naviguer entre les pages, utilisez le composant `&lt;Link&gt;` de Next.js plutôt que des balises `&lt;a&gt;` classiques. Le composant `&lt;Link&gt;` effectue une **navigation côté client** sans recharger la page complète.

``` ts title="app/produits/page.tsx"
--8<-- "next-routage/app/produits/page.tsx"
```

!!! manuel
    [Link Component - Documentation Next.js](https://nextjs.org/docs/app/api-reference/components/link)

## Routes imbriquées et layouts partagés

Les layouts sont **partagés** entre les routes enfants. Lorsque vous naviguez entre des pages qui partagent un layout, seul le contenu de la page change, pas le layout.

```
app/
├── layout.tsx            ← Layout racine (navigation principale)
├── page.tsx              ← Page d'accueil
└── produits/
    ├── layout.tsx        ← Layout pour la section produits
    ├── page.tsx          ← Liste des produits
    └── [id]/
        └── page.tsx      ← Détail d'un produit
```

Avec cette structure, le layout racine (`app/layout.tsx`) enveloppe tout, et le layout des produits (`app/produits/layout.tsx`) enveloppe seulement les pages de la section produits.

## Comparaison avec React Router

| Concept | React Router | Next.js |
|---|---|---|
| Définition des routes | `&lt;Route path="/produits" element={&lt;Produits /&gt;} /&gt;` | Dossier `app/produits/page.tsx` |
| Routes dynamiques | `&lt;Route path="/produits/:id" ... /&gt;` | Dossier `app/produits/[id]/page.tsx` |
| Accès aux paramètres | `useParams()` | Propriété `params` du composant |
| Navigation | `&lt;Link to="/produits"&gt;` | `&lt;Link href="/produits"&gt;` |
| Layout partagé | `&lt;Outlet /&gt;` dans un composant parent | `layout.tsx` avec `{children}` |
| Chargement | Géré manuellement | `loading.tsx` automatique |
| Erreurs | Géré manuellement | `error.tsx` automatique |
