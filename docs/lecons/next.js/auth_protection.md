# Protection des routes avec Auth.js

## Stratégies de protection

Dans une application Web, il va arriver qu'on doivent protéger les données selon l'utilisateur (données personnelles) ou dues à un rôle particulier (un administrateur, un directeur, etc.). Avec Next.JS, on peut contrôler l'accès de deux manières, avec un intergiciel ou directement dans un composant serveur. (La vérification dans un composant client est insécure car une personne malicieuse peut lire et modifier le javascript dans le navigateur.)

!!! manuel
    [Protecting Resources - Auth.js](https://authjs.dev/getting-started/session-management/protecting)  
    [Middleware - Documentation Next.js](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## Intergiciel (Middleware)

Le fichier `middleware.ts` s'exécute sur le serveur avant chaque requête, une bonne place pour valider globalement les routes accessibles ou non d'un utilisateur.  

### Configuration minimale

Créez le fichier `middleware.ts` à la racine du projet :

``` ts title="middleware.ts"
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

L'expression régulière dans `matcher` exclut les ressources statiques et les routes API internes, mais intercepte toutes les autres requêtes.

Avec cette configuration minimale, toute page non accessible sans session sera automatiquement redirigée vers la page de connexion. 

### Logique personnalisée

Si vous voulez des règles plus précises (rediriger les utilisateurs déjà connectés, protéger seulement certains chemins), utilisez la forme complète :

``` ts title="middleware.ts"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const estConnecte = !!req.auth
  const chemin = req.nextUrl.pathname

  const cheminsPublics = ["/", "/connexion", "/inscription"]
  const estCheminPublic = cheminsPublics.includes(chemin)

  if (!estConnecte && !estCheminPublic) {
    return NextResponse.redirect(new URL("/connexion", req.url))
  }

  if (estConnecte && chemin === "/connexion") {
    return NextResponse.redirect(new URL("/tableau-de-bord", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

## Vérification de session côté serveur

Si vous voulez plus de contrôle dans un composant serveur spécifique, l'idéal est de vérifier l'authentification directement dans le composant. C'est aussi dans le composant que peut être générée une vue authentifiée et non authentifiée. (Imaginez une page qui affiche une recette en lecture seule lorsque l'utilisateur n'est pas authentifié et l'ajout d'un bouton d'édition dans le cas contraire).


### Dans un composant serveur

``` tsx title="app/tableau-de-bord/page.tsx"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function TableauDeBord() {
  const session = await auth()

  if (!session) {
    redirect("/connexion")
  }

  return (
    <div>
      <h1>Tableau de bord</h1>
      <p>Bienvenue, {session.user?.name}</p>
    </div>
  )
}
```

### Dans une action serveur

``` ts title="app/actions/commandes.actions.ts"
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function creerCommande(formData: FormData) {
  const session = await auth()

  if (!session) {
    throw new Error("Vous devez être connecté pour effectuer cette action.")
  }

  await prisma.commande.create({
    data: {
      utilisateurId: Number(session.user?.id),
      produitId: Number(formData.get("produitId")),
    },
  })
}
```

## Protection par rôle

Pour des applications avec plusieurs niveaux d'accès (utilisateur, administrateur, etc.), étendez les types de session et vérifiez le rôle.

### 1. Étendre les types de session

``` ts title="types/next-auth.d.ts"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
  interface User {
    role?: string
  }
}
```

### 2. Propager le rôle dans les callbacks

``` ts title="auth.ts"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // configuration...
      authorize: async (credentials) => {
        const utilisateur = await trouverUtilisateur(credentials)
        if (!utilisateur) return null
        return {
          id: String(utilisateur.id),
          name: utilisateur.nom,
          email: utilisateur.courriel,
          role: utilisateur.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
  },
})
```

### 3. Vérifier le rôle dans une page

``` tsx title="app/admin/page.tsx"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function PageAdmin() {
  const session = await auth()

  if (!session) {
    redirect("/connexion")
  }

  if (session.user?.role !== "admin") {
    redirect("/acces-refuse")
  }

  return (
    <div>
      <h1>Panneau d'administration</h1>
      <p>Connecté en tant qu'administrateur : {session.user?.name}</p>
    </div>
  )
}
```