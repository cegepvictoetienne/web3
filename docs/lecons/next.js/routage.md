# Routage dans Next.js

## Routage basé sur l'arborescence sous app/  


Au lieu d'un module externe comme React Router, Next.JS se fit sur la structure des répertoires sous `app/`. Chaque dossier est une partie de l'URL. (par exemple, /app/login serait l'url http://localhost:3000/login). Next.JS lit le fichier `page.tsx` pour rendre le chemin accessible.


```
app/
├── page.tsx             
├── a-propos/
│   └── page.tsx         
└── produits/
    ├── page.tsx          
    └── [id]/
        └── page.tsx       
```

!!! manuel
    [Routing - Next.js](https://nextjs.org/docs/app/building-your-application/routing)

### page.tsx

Fichier essentiel pour le bon fonctionnement d'une route. C'est en fait un composant React qui doit être exporté. Le nom du composant n'a pas beaucoup d'importance.

``` ts title="app/page.tsx"
--8<-- "next-routage/app/page.tsx"
```

``` ts title="app/a-propos/page.tsx"
--8<-- "next-routage/app/a-propos/page.tsx"
```

### layout.tsx

Le look des pages enfants, idéal à la racine de pages ayant un look similaire :

``` ts title="app/layout.tsx"
--8<-- "next-routage/app/layout.tsx"
```

Le composant `{children}` sera remplacé par le contenu de la page active, un peu comme  `<Outlet />` dans React Router.

### loading.tsx

Pour avoir un indicateur de chargement d'une page qui prend plus de temps à charger :

``` ts title="app/produits/loading.tsx"
--8<-- "next-routage/app/produits/loading.tsx"
```

### error.tsx

Si vous voulez gérer localement les erreurs. Ce fichier doit obligatoirement être un **Client Component** (`"use client"`) :

``` ts title="app/produits/error.tsx"
--8<-- "next-routage/app/produits/error.tsx"
```

## Routes dynamiques avec \[parametre\]

Il arrive qu'on désire créer des pages dynamiques, accessible par un identifiant. Imaginez une page de produit qui est accessible par /produit/1234 (1234 étant le code de produit). Pour faire ça, on crée une route telle que ceci :  `app/produit/[id]/page.tsx` qui accepte n'importe quelle valeur pour `id`. 

``` ts title="app/produits/[id]/page.tsx"
--8<-- "next-routage/app/produits/[id]/page.tsx"
```

Le paramètre est accessible via la propriété `params` du composant qui est une Promise qu'il faut attendre avec `await`.

## Navigation avec le composant Link

Pour faire des liens internes dans votre application, utilise le composant `<Link>` de Next.js plutôt que des `<a>`. Le composant `<Link>` effectue une **navigation côté client** sans recharger la page complète.

``` ts title="app/produits/page.tsx"
--8<-- "next-routage/app/produits/page.tsx"
```

!!! manuel
    [Link Component - Documentation Next.js](https://nextjs.org/docs/app/api-reference/components/link)

